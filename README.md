# Teste Takeat

## Ferramentas utilizadas:

- express de framework;
- pino para logs da aplicação;
- jsonwebtoken para autenticação via jwt;
- sequelize para ORM;
- bcrypt para criptografia do password;

<br />

## Como executar a aplicação:

### Criar arquivo .env na raiz do projeto
- Definir SECRET_HASH da aplicação


## Rotas e exemplos:

<br />
Para cadastrar num novo restaurante

#### [POST] em /public/restaurants
<br />

```json
{
	"username": "Restaurante1",
	"email": "restaurante1@gmail.com",
	"address": "Rua da estação",
	"password": "1234",
	"phone": "12356",
	"has_service_tax": "false"
}
```
<br />
Para fazer login de um restaurante

#### [POST] em /public/login


```json
{
	"email": "restaurante1@gmail.com",
	"password":"1234"
}
```
<br />
Para cadastrar um novo produto

#### [POST] em /restaurant/products


```json
{
	"name": "macarrao",
	"value": "23"
}
```
<br />
Para cadastrar um novo pedido

#### [POST] em /restaurant/orders


```json
{
	"name": "leo",
	"phone": "75991922332",
	"product_id": "70",
	"amount": "2"
}
```
<br />
As rotas tipo GET são acionadas somente com o token no headers
<br />
# Projeto Takeat
