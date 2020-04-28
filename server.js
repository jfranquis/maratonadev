//express = require (pedido para o node_modules configurar express)
//configutando servidor
const express = require("express")
//O servidor para receber a funcionalidade express
const server = express()


//configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({ extended: true }))


// configuração com o banco de dados (pgbird)
const Pool = require ('pg'). Pool
const db = new Pool({
    user: 'postgres', 
    password:  '137856',
    host:'localhost',
    port:'5432',
    database:'doe'
})


//configurando a template engine, motor para criar template
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, /* dados booleano que aceita 2 valores, verdadeiro ou falso*/
})

// agrupamento de dados - lista de doadores: Vetor ou Array
/*const donors = [
    {
        name: "Janaina Franquis",
        blood: "AB+",
        phone: "(11) 97645-5655",
    },
    {
        name: "Ana Paula Souza",
        blood: "O-",
        phone: "(11) 97645-5655",
    },
    {
        name: "Diego Fernandes",
        blood: "A-",
        phone: "(11) 97645-5655",
    },
    {
        name: "Robson Marques",
        blood: "O+",
        phone: "(11) 97645-5655",
    },

]*/


//configurar a apresentação da pagina)
server.get("/", function (req, res) {
    db.query("SELECT * FROM donors", function(err, result) {
        if(err) return res.send("Erro de banco de dados.")

        const donors = result.rows;
    
    return res.render("index.html", { donors })
    })
})
// pegar dados do formulario
server.post("/", function (req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    const phone = req.body.phone

    // se  sinal = atribuir valor a uma variavel e ==  verificando se a variavel está vazia  e ||  ou está vazio " "  
    if (name == ""|| email == "" || blood == "" || phone == ""){
        return res.send("Todos os campos são obrigatórios.")
    }


    /* colocar valor dentro do array automaticamente
    donors.push({
        name: name,
        blood: blood,
        phone: phone,
    }) */
    // colocar valores dentro do banco de dados
    const query = `
            INSERT INTO donors ("name", "email", "blood", "phone")
             VALUES($1, $2, $3, $4) `

    const values = [name, email, blood, phone]

    db.query(query, values, function(err) {
       //fluxo de erro
        if (err) return res.send("erro no banco de dados.")

        // Fluxo ideal
        return res.redirect("/")

    } )
 
})

// ligar o servidor e permitir o acesso na porta 3000
//listen Criar servidor
server.listen(3000, function () {
    console.log("iniciei o servidor.")
})
