1 - criar cluster com o kind:
```bash 
k3d cluster create mycluster
```
2 - informações sobre o cluster pelo o kubectl
```bash
kubectl cluster-info --context kind-kind
```

2.1 - listar configurações de clusters
```bash
kubectl config get-clusters
```
2.2 - mudar contexto de cluster
```bash
kubectl config use-context nome-do-cluster
```
kubectl config unset contexts.NomeDoContexto

3 - create a cluster with config and name
```bash
kind create cluster --config=k8s/kind.yaml --name=fullcycle
```
1 - mount image:
```docker build -t andersonfrfilho/hello-nodejs .```
2 - test image
```docker run --rm -p 3000:3000 andersonfrfilho/hello-nodejs```

3 - criar pod
```sh
kubectl apply -f k8s/pod.yaml
```

4 - Olhar os logs
kubectl logs nomeDoPod

5 - Deletar deployment
kubectl delete deploy nodeDeployment

5.1 - Deletar um statefulset
kubectl delete StatefulSet postgres

## para acessar os pods vc temq eu ter um mecanismo de rede que são os services

7 - caso tenha 1problema no get de pods executar:
```sh
kubectl config set-context --current --namespace=default
```

8 - Executar comando dentro dos pods:
``` kubectl exec -it nome-do-pod -- bash```

9 - verificar service criado (postgres-h) nome_service:
```ping postgres-h```

10 - verificar service por pod (postgres-0.postgres-h) nome do nome_pod.nome_service
```ping postgres-0.postgres-h```
obs:
- ```pod.service.namespace.service.cluster.local```
- ```postgres-3.postgres-h.default.svc.cluster.local```

## Replicaset
- ficam monitorando quando a aplicação cair e replicam os pods
11 - traz todas replicasets
```kubectl get replicasets```

## Deployments:
- modificam as replicas conforme as versões mudam
12 - rollout mostrar as revision
```kubectl rollout history deployment nodejs-server-deployment```
13 - retornar para versão anterior
```kubectl rollout undo deployment nodejs-server-deployment```
14 - retornar para versão especifica
```kubectl rollout undo deployment nodejs-server-deployment --to-revision={{pegue a revision com o comando de history}}```
15 - detalhes do objeto de deployment
```kubectl describe deployment nodejs-server-deployment```

## services
- services são responsaveis pelo a comunicação dentro do kubernetes
13 - redirecionamento de porta no kubernetes
- ```kubectl port-forward service/nodejs-server-service 3000:3000```
14 - acessar o service por um proxy do kubernetes para informações da api do kubernets
- ```kubectl proxy --port=3000```
* ClusterIp -> ip interno do servidor
* NodePort -> expor pra fora uma porta
* LoadBalancer -> gera um ip para vc acessar seu app de fora

15 - descrição de pods:
```kubectl describe pod nomeDoPod```

16 - kubectl --generator
17 - instalar metricas no cluster
  * 
ver informações do cluster hpa
```watch -n1 kubectl get hpa```
ver informações de top pod
```kubectl top pod nodejs-server-78676c7f4f-qmp7k```
17 - HPA 
baixe o servico:
wget link do repositório
https://github.com/kubernetes-sigs/metrics-server

1 - vai baixa o seguinte arquivo:
2 - components.yaml
3 - renomeie para metrics-server
4 - para executar local adicione no seguinte arquivo na parte que original:
```yaml
spec:
  selector:
    matchLabels:
      k8s-app: metrics-server
  strategy:
    rollingUpdate:
      maxUnavailable: 0
  template:
    metadata:
      labels:
        k8s-app: metrics-server
    spec:
      containers:
      - args:
        - --cert-dir=/tmp
        - --secure-port=443
        - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
        - --kubelet-use-node-status-port
        - --metric-resolution=15s
```
adicione a ultima linha:
```yaml
spec:
  selector:
    matchLabels:
      k8s-app: metrics-server
  strategy:
    rollingUpdate:
      maxUnavailable: 0
  template:
    metadata:
      labels:
        k8s-app: metrics-server
    spec:
      containers:
      - args:
        - --cert-dir=/tmp
        - --secure-port=443
        - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
        - --kubelet-use-node-status-port
        - --metric-resolution=15s
        - --kubelet-insecure-tls
```
teste de carga: utilizando o fortio
//-it crie a image
//--rm remove o container quando terminar
//--image= nome da imagem 
//-- execute o comando dentro da imagem
//load-> lib do fortio
//-qps (queries per seconds) numeros de queries por segundo
//-t tempo de execução do teste
//-c números de conexões
kubectl run -it fortio --rm --image=andersonfrfilho/hello-nodejs:1.1.15
```sh
kubectl run -it fortio --rm --image=fortio/fortio -- load -qps 1800 -t 120s -c 70 "http://nodejs-server-service:3000/healthz"
```
process for deploy in cloud service kubernetes
```sh
❯ kubectl apply -f k8s/deployment.yaml
```
response:
```
deployment.apps/nodejs-server created
```
```sh
❯ kubectl apply -f k8s/service.yaml
```
response:
```
service/nodejs-server-service created
```
```sh
❯ kubectl apply -f k8s/configmap-env.yaml
```

response:
```
configmap/nodejs-server-env created
```
```sh
❯ kubectl apply -f k8s/secret.yaml
```
response:
```
secret/nodejs-server-secret-env created
```
```sh
❯ kubectl apply -f k8s/metrics-server.yaml
```
response:
```
serviceaccount/metrics-server configured
clusterrole.rbac.authorization.k8s.io/system:aggregated-metrics-reader created
clusterrole.rbac.authorization.k8s.io/system:metrics-server configured
rolebinding.rbac.authorization.k8s.io/metrics-server-auth-reader configured
clusterrolebinding.rbac.authorization.k8s.io/metrics-server:system:auth-delegator configured
clusterrolebinding.rbac.authorization.k8s.io/system:metrics-server configured
service/metrics-server configured
deployment.apps/metrics-server created
apiservice.apiregistration.k8s.io/v1beta1.metrics.k8s.io configured
```

```sh
❯ kubectl apply -f hpa.yaml
```
response:
```
horizontalpodautoscaler.autoscaling/nodejs-server-hpa created
```

acessar app
kubectl port-forward service/nodejs-server-service 3000:80
navegador:
http://localhost:3000/healthz

get cluster
```
kubectl config get-contexts
```
set config cluster
```
kubectl config use-context k3d-cherry-go-cluster
```

Ingress:
* install helm https://helm.sh/docs/intro/install/
* install ingress https://kubernetes.github.io/ingress-nginx/deploy/#using-helm
obs:use helm

install cert-manager
1 - Helm (https://cert-manager.io/docs/installation/helm/)

INstall customDefinition
- kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.4/cert-manager.crds.yaml

## Name-Space
```sh
kubectl create namespace dev
```
```sh
kubectl get po -n=dev
```
```sh
kubectl get po -n=prod
```

criar contexto dentro do cluster

```
kubectl config current-context
```
```sh
kubectl config set-context dev --namespace=dev --cluster=NomeDoCluster --user=kind-user
```

```sh
kubectl config set-context prod --namespace=prod --cluster=NomeDoCluster --user=kind-user
```