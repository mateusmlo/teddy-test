# teddy backend-challenge

## Sobre o desafio

Um desafio simples que consistiu em desenvolver um encurtador de URLs com rotas de autenticação e registro de usuário. Alguns detalhes da minha implementação:

- Autenticação local com e-mail e senha para acesso ao sistema e com JWT para as rotas protegidas.
- URLs são encurtadas com um identificador único gerado pela biblioteca nanoid.
- Payloads são validados com o uso de DTOs e decorators da biblioteca class-validator.
- API documentada com Swagger.
- Uso de variáveis de ambiente para não expor na aplicação dados sensíveis de autenticação ao banco de dados, JWT secrets e portas de acesso.

#### Pontos de atenção:

- Os endpoints que redirecionam o usuário à URL original não funcionam em ambientes como Postman, Insomnia ou Swagger.

#### Escalabilidade:

- O uso de Docker e docker-compose facilita o escalamento vertical da aplicação, bastando apenas executar novas instâncias e opcionalmente mapear as URLs em um proxy reverso, para que o usuário acesse sempre o mesmo domínio mas tenha seu pedido processado por qualquer instância que esteja com mais capacidade de processamento.
- Já o escalamento horizontal da aplicação teria como maiores desafios a administração dos bancos de dados e demais infraestruturas que os cloud providers abstraem.

## Stack

- NestJS
- Swagger
- TypeORM
- MySQL
- Passport
- Docker
- OpenTelemetry
- Prometheus

## Como Rodar

Primeiramente faça uma cópia do arquivo .env.example para um .env e utilize a porta de sua escolha para a variável APP_PORT e também valores para a senha do banco de dados e segredo dos tokens:

```sh
cp .env.example .env
```

### Para executar localmente

```sh
# subir as dependências da aplicação
docker-compose up -d
```

E pronto! A aplicação estará disponível em localhost na porta especificada.


#### OPCIONAL: executar no próprio terminal

⚠️ Caso a API esteja executando no Docker pode ocorrer um conflito de portas, nesse caso é necessário parar a execução da API no container ou alterar o valor da variável APP_PORT no arquivo .env

Para executar no próprio terminal:

```sh
# instalar as dependências
yarn

# iniciar o server
yarn start:dev

# rodar os testes
yarn test
```
