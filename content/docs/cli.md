# CLI Usage

This document demonstrates how to use the CLI but also shows what happens in KUDO under the hood, which can be helpful when troubleshooting.

<h2>Table of Contents</h2>

[[toc]]

## Setup the KUDO Kubectl Plugin

### Requirements

- `kubectl` version `1.13.0` or newer
- KUDO CRDs installed to your cluster and KUDO controller is running. See the [getting started guide](README.md) for instructions
- `kubectl kudo` is running outside your cluster

### Installation

You can either install the CLI plugin using `brew`:

```bash
brew tap kudobuilder/tap
brew install kudo-cli
```

or you can compile and install the plugin from your `$GOPATH/src/github.com/kudobuilder/kudo` root folder via:

```bash
make cli-install
```

## Commands

::: flag kubectl kudo install &lt;name&gt; [flags]
Install an Operator from the official [kudobuilder/operators](https://github.com/kudobuilder/operators) repository.
:::

::: flag kubectl kudo get instances [flags]
Show all available instances.
:::

::: flag kubectl kudo package &lt;operator_folder&gt; [flags]
Packages an operator in a folder into a tgz file.
:::

::: flag kubectl kudo plan status [flags]
View all available plans.
:::

::: flag kubectl kudo plan history &lt;name&gt; [flags]
View all available plans.
:::

::: flag kubectl kudo version
Print the current KUDO package version.
:::

::: flag kubectl kudo update
Update installed operator parameters.
:::

::: flag kubectl kudo upgrade
Upgrade installed operator from one version to another.
:::

## Flags

::: tip Usage
`kubectl-kudo install <name> [flags]`
:::

::: flag --auto-approve
Skip interactive approval when existing version found. (default `false`)
:::

::: flag -h, --help
help for install
:::

::: flag --instance (string)
The instance name. (default: Operator name)
:::

::: flag --kubeconfig (string)
The file path to Kubernetes configuration file. (default: "$HOME/.kube/config")
:::

::: flag --namespace (string)
The namespace used for the operator installation. (default: "default")
:::

::: flag --package-version (string)
A specific package version on the official GitHub repo. (default to the most recent)
:::

::: flag -p, --parameter (stringArray)
The parameter name and value separated by '='
:::

## Examples

### Install a Package

There are four options how to install a package. For development you can install packages from your local filesystem or local tgz file.
For testing, or working without a repository, it is possible to install from a URL. Another option is to install from the package repository.

Installation during development can use a relative or absolute path to the package folder.
```bash
kubectl kudo install pkg/kudoctl/bundle/testdata/zk
```

To support the installation of operators not yet in the repository, it is possible to install directly from a url.
```bash
kubectl kudo install http://kudo.dev/zk.tgz
```

For normal operations it is recommended to use the official packages provided through the [kudobuilder/operators](https://github.com/kudobuilder/operators) repository.
To install official kafka package you have to do the following:

```bash
kubectl kudo install kafka
```

Both of these options will install new instance of that operator into your cluster. By default, the instance name will be generated.

### Install a package overriding instance name and parameters

Use `--instance` and `--parameter`/`-p` for setting an Instance name and Parameters, respectively:

```bash
$ kubectl kudo install kafka --instance=my-kafka-name --parameter ZOOKEEPER_URI=zk-zk-0.zk-hs:2181,zk-zk-1.zk-hs:2181,zk-zk-2.zk-hs:2181 --parameter ZOOKEEPER_PATH=/small -p BROKERS_COUNTER=3
operator.kudo.dev/kafka unchanged
operatorversion.kudo.dev/kafka unchanged
No instance named 'my-kafka-name' tied to this "kafka" version has been found. Do you want to create one? (Yes/no)
instance.kudo.dev/v1alpha1/my-kafka-name created
$ kubectl get instances
NAME            AGE
my-kafka-name   6s
```


### Get Instances

You can use the `get` command to get a list of all current instances:

```bash
kubectl kudo get instances --namespace=<default> --kubeconfig=<$HOME/.kube/config>
```

Example:

```bash
$ kubectl kudo get instances
  List of current instances in namespace "default":
  .
  ├── small
  ├── up
  └── zk
```

This maps to the `kubectl` command:

`kubectl get instances`

Example:

```bash
$ kubectl kudo get instances
  NAME      CREATED AT
  small     4d
  up        3d
  zk        4d
```

### Get the Status of an Instance

Now that you have a list of available instances, you can get the current status of all plans for one of them:

`kubectl kudo plan status --instance=<instanceName> --kubeconfig=<$HOME/.kube/config>`

**Note**: The `--instance` flag is mandatory.

```bash
$ kubectl kudo plan status --instance=up
  Plan(s) for "up" in namespace "default":
  .
  └── up (Operator-Version: "upgrade-v1" Active-Plan: "up-deploy-493146000")
      ├── Plan deploy (serial strategy) [COMPLETE]
      │   └── Phase par (serial strategy) [COMPLETE]
      │       └── Step run-step (COMPLETE)
      ├── Plan update (serial strategy) [NOT ACTIVE]
      │   └── Phase par (serial strategy) [NOT ACTIVE]
      │       └── Step par (serial strategy) [NOT ACTIVE]
      │           └── run-step [NOT ACTIVE]
      └── Plan upgrade (serial strategy) [NOT ACTIVE]
          └── Phase par (serial strategy) [NOT ACTIVE]
              └── Step par (serial strategy) [NOT ACTIVE]
                  └── run-step [NOT ACTIVE]
```

In this tree chart you see all important information in one screen:

* `up` is the instance you specified.
* `default` is the namespace you are in.
* `upgrade-v1` is the instance's **Operator-Version**.
* `up-deploy-493146000` is the current **Active-Plan**.
    + `par` is a serial phase within the `deploy` plan which is `COMPLETE`.
    + `deploy` is a `serial` plan which is `COMPLETE`.
    + `run-step` is a `serial` step which is `COMPLETE`.
* `update` is another `serial` plan that is currently `NOT ACTIVE`.
    + `par` is a serial phase within the `update` plan which is `NOT ACTIVE`.
    + `par` is a `serial` collection of steps which is `NOT ACTIVE`.
    + `run-step` is a `serial` step within the `par` step collection which is `NOT ACTIVE`.
* `upgrade` is another `serial` plan which is currently `NOT ACTIVE`.
    + `par` is a serial phase within the `upgrade` plan which is `NOT ACTIVE`
    + `par` is a `serial` collection of steps which is `NOT ACTIVE`.
    + `run-step` is a `serial` step within the `par` step collection which is `NOT ACTIVE`.

For comparison, the according `kubectl` commands to retrieve the above information are:

* `kubectl get instances` (to get the matching `OperatorVersion`)
* `kubectl describe operatorversion upgrade-v1` (to get the current `PlanExecution`)
* `kubectl describe planexecution up-deploy-493146000` (to get the status of the `Active-Plan`)

Here, you can find the overview of all available plans in `Spec.Plans` of the matching `OperatorVersion`:

```bash
$ kubectl describe operatorversion upgrade-v1
Name:         upgrade-v1
Namespace:    default
Labels:       controller-tools.k8s.io=1.0
Annotations:  kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"kudo.dev/v1alpha1","kind":"OperatorVersion","metadata":{"annotations":{},"labels":{"controller-tools.k8s.io":"1.0"},"name":"upgra...
API Version:  kudo.dev/v1alpha1
Kind:         OperatorVersion
Metadata:
  Cluster Name:
  Creation Timestamp:  2018-12-14T19:26:44Z
  Generation:          1
  Resource Version:    63769
  Self Link:           /apis/kudo.dev/v1alpha1/namespaces/default/operatorversions/upgrade-v1
  UID:                 30fe6209-ffd6-11e8-abd5-080027d506c7
Spec:
  Connection String:
  Operator:
    Kind:  Operator
    Name:  upgrade
  Parameters:
    Default:       15
    Description:   how long to have the container sleep for before returning
    Display Name:  Sleep Time
    Name:          SLEEP
    Required:      false
  Plans:
    Deploy:
      Phases:
        Name:  par
        Steps:
          Name:  run-step
          Tasks:
            run
        Strategy:  serial
      Strategy:    serial
    Update:
      Phases:
        Name:  par
        Steps:
          Name:  run-step
          Tasks:
            run
        Strategy:  serial
      Strategy:    serial
    Upgrade:
      Phases:
        Name:  par
        Steps:
          Name:  run-step
          Tasks:
            run
        Strategy:  serial
      Strategy:    serial
  Tasks:
    Run:
      Resources:
        job.yaml
  Templates:
    Job . Yaml:  apiVersion: batch/v1
kind: Job
metadata:
  namespace: default
  name: {{PLAN_NAME}}-job
spec:
  template:
    metadata:
      name: {{PLAN_NAME}}-job
    spec:
      restartPolicy: OnFailure
      containers:
      - name: bb
        image: busybox:latest
        imagePullPolicy: IfNotPresent
        command:
        - /bin/sh
        - -c
        - "echo {{PLAN_NAME}} for v1 && echo Going to sleep for {{SLEEP}} seconds && sleep {{SLEEP}}"

  Version:  1.0.0
Events:     <none>
```

You can then find the status of the currently applied plan when looking at the particular `PlanExecution`:

```bash
$ kubectl describe planexecution up-deploy-493146000
  Name:         up-deploy-493146000
  Namespace:    default
  Labels:       operator-version=upgrade-v1
                instance=up
  Annotations:  <none>
  API Version:  kudo.dev/v1alpha1
  Kind:         PlanExecution
  Metadata:
    Cluster Name:
    Creation Timestamp:  2018-12-14T19:26:44Z
    Generation:          1
    Owner References:
      API Version:           kudo.dev/v1alpha1
      Block Owner Deletion:  true
      Controller:            true
      Kind:                  Instance
      Name:                  up
      UID:                   3101bbe5-ffd6-11e8-abd5-080027d506c7
    Resource Version:        63815
    Self Link:               /apis/kudo.dev/v1alpha1/namespaces/default/planexecutions/up-deploy-493146000
    UID:                     31037dd0-ffd6-11e8-abd5-080027d506c7
  Spec:
    Instance:
      Kind:       Instance
      Name:       up
      Namespace:  default
    Plan Name:    deploy
  Status:
    Name:  deploy
    Phases:
      Name:   par
      State:  COMPLETE
      Steps:
        Name:    run-step
        State:   COMPLETE
      Strategy:  serial
    State:       COMPLETE
    Strategy:    serial
  Events:        <none>
```

Finally, the status information for the `Active-Plan` is nested in this part:

```bash
  Status:
    Name:  deploy
    Phases:
      Name:   par
      State:  COMPLETE
      Steps:
        Name:    run-step
        State:   COMPLETE
      Strategy:  serial
    State:       COMPLETE
    Strategy:    serial
```

Apparently, KUDO's tree view makes this information easier to understand and prevents you from putting together the bits and pieces of various commands.

### Delete an Instance

You can delete an instance (i.e. uninstall it from the cluster) using `kubectl delete instances <instanceName>`. The deletion of an instance triggers the removal of all the objects owned by it.

### Get the History to PlanExecutions

This is helpful if you want to find out which plan ran on your instance to a particular `OperatorVersion`.
Run this command to retrieve all plans that ran for the instance `up` and its OperatorVersion `upgrade-v1`:

```bash
$ kubectl kudo plan history upgrade-v1 --instance=up
  History of plan-executions for "up" in namespace "default" to operator-version "upgrade-v1":
  .
  └── up-deploy-493146000 (created 4h56m12s ago)
```

Run this command to retrieve the history of all plans applied to an instance:

```bash
$ kubectl kudo plan history --instance=up
  History of all plan-executions for "up" in namespace "default":
  .
  └── up-deploy-493146000 (created 4h52m34s ago)
```

This includes the previous history but also all OperatorVersions that have been applied to the selected instance.

### Package an Operator

You can use the `package` command to package an operator into a tarball. The package name will be determined by the operator metadata in the package files.  The folder of the operator is passed as an argument. It is possible to pass a `--destination` location to build the tgz file into.

`kubectl kudo package zookeeper --destination=target`

Example:

```bash
$ kubectl kudo package ../operators/repository/zookeeper/operator/ --destination=~
  Package created: /Users/kensipe/zookeeper-0.1.0.tgz
```

### Update parameters on running operator instance

Every operator can define overridable parameters in `params.yaml`. When installing an operator and deploying an instance, you can use the defaults or override them with `-p` parameters to `kudo install`.

The `kudo update` command allows you to change these parameters even on an already running operator instance. For example, if you have an instance in your cluster named `dev-flink` (you can figure out what you have installed with `kubectl get instances`) and that operator exposes a parameter with the name `param`, you can change its value with the following command:

`kubectl kudo update --instance dev-flink -p param=value`

### Upgrade running operator from one version to another

Following the same example from the previous section, having a `dev-flink` instance installed, we can upgrade it to a newer version with the following command:

`kubectl kudo upgrade flink --instance dev-flink -p param=xxx`

A new version of that operator is installed to the cluster and `upgrade` (or `deploy`) plan is started to roll out new flink pods.

At the same time, we're overriding the value of the parameter `param`. That is optional and you can always do it in a separate step via `kudo update`.
