import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

export class FormularioAutor extends Component{
    constructor() {
        super()  
        this.state = {nome:'', email:'', senha:''}
        //Definir o this do React na function enviarForm
        this.enviarForm = this.enviarForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
 
    }


    enviarForm(evento){
        evento.preventDefault();
        console.log('Enviado');
        $.ajax({
          // url:"http://cdc-react.herokuapp.com/api/autores",
          url:"http://localhost:8080/api/autores",
          contentType: 'application/json',
          dataType: 'json',
          type: 'post',
          data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
          success:function(novalistagem){
            PubSub.publish('atualiza-lista-autores', novalistagem);
            // this.props.callBackAtualizarListagem(resposta);
            // this.setState({lista: resposta});
            // console.log('Enviado Sucesso');
            this.setState({nome:"", email:"",senha:""});
          }.bind(this),
          error: function(resposta){
            if (resposta.status === 400) {
              //recuperar quais foram os erros
              //exibir a mensagem de erro no campo  
              console.log(resposta);
              new TratadorErros().publicaErros(resposta.responseJSON);
            }
          },
          beforeSend: function(){
            PubSub.publish('limpar-erros', {})
          }
        });

      }
    
      setNome(evento){
        this.setState({
          nome: evento.target.value
        })
      }
    
      setEmail(evento){
        this.setState({
          email: evento.target.value
        })
      }
    
      setSenha(evento){
        this.setState({
          senha: evento.target.value
        })
      }
      

    render(){
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned"
                onSubmit={this.enviarForm} method="post">
                <InputCustomizado 
                    id="nome" label = "Nome" type = "text" name="nome" value={this.state.nome} onChange={this.setNome}
                />
                <InputCustomizado 
                    id="email" label="Email" type="email" name="email" value={this.state.email} onChange={this.setEmail}
                />
                <InputCustomizado 
                    id="senha" label="Password"type="password" name="senha" value={this.state.senha}  onChange={this.setSenha}
                />
                <div className="pure-control-group">
                    <label></label>
                    <button type="submit" className="pure-button pure-button-primary">
                    Gravar
                        </button>
                </div>
                </form>
            </div>
        )
    }
}

export class TabelaAutores extends Component{
        
    render(){
        return(
            <div>
            <table className="pure-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.lista.map(function (autor) {
                    return (
                      <tr key={autor.id}>
                        <td>{ autor.nome }</td>
                        <td>{ autor.email }</td>
                      </tr>
                    );
                  })
                }

              </tbody>
            </table>
          </div>
        )
    }
}


export default class AutorBox extends Component{
  constructor() {
    super()  
    this.state = { lista: []};
  }

  componentDidMount(){
    $.ajax({
      // url:"http://cdc-react.herokuapp.com/api/autores",
      url:"http://localhost:8080/api/autores",
      dataType: 'json',
      success:function(resposta){
        this.setState({lista: resposta});
      }.bind(this)
    });

    PubSub.subscribe('atualiza-lista-autores', function(topico, novaLista){
      this.setState({lista: novaLista});
    }.bind(this));
  }
    
  render(){
        return(
            <div>
              <div>
                  <div className="header">
                    <h1>Cadatro de Autores</h1>
                  </div>
                  <br />
                  <div className="content" id="content">
                    <FormularioAutor />
                    <TabelaAutores lista={this.state.lista}/>
                </div>
              </div>
            </div>
        );
    }
}