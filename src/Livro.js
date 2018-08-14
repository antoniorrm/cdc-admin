import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

export class FormularioLivro extends Component{
    constructor() {
        super()  
        this.state = {titulo:'', preco:'', autor:''}
        //Definir o this do React na function enviarForm
        this.enviarForm = this.enviarForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
 
    }


    enviarForm(evento){
        evento.preventDefault();
        console.log('Enviado');
        $.ajax({
          // url:"http://cdc-react.herokuapp.com/api/autores",
          url:"http://localhost:8080/api/livros",
          contentType: 'application/json',
          dataType: 'json',
          type: 'post',
          data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId}),
          success:function(novalistagem){
            PubSub.publish('atualiza-lista-livros', novalistagem);
            // this.props.callBackAtualizarListagem(resposta);
            // this.setState({lista: resposta});
            // console.log('Enviado Sucesso');
            this.setState({titulo:"", preco:"",autorId:""});
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
    
      setTitulo(evento){
        this.setState({
          titulo: evento.target.value
        })
      }
    
      setPreco(evento){
        this.setState({
          preco: evento.target.value
        })
      }
    
      setAutorId(evento){
        this.setState({
          autorId: evento.target.value
        })
        
      }
      

    render(){
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned"
                onSubmit={this.enviarForm} method="post">
                <InputCustomizado 
                    id="titulo" label = "Titulo" type = "text" name="titulo" value={this.state.titulo} onChange={this.setTitulo}
                />
                <InputCustomizado 
                    id="preco" label="Preco" type="number" name="preco" value={this.state.preco} onChange={this.setPreco}
                />
                
                <div className="pure-control-group">
                    <label htmlFor= "autorId"> Autor</label>
                    <select value={this.state.autorId} name="autorId" id="autoId" onChange={this.setAutorId}>
                        <option value="">Selecione o autor</option>
                        {   this.props.autores.map(function(autor){
                                return <option key={autor.id} valeu={autor.id}>{autor.id}</option>
                            })
                        }
                    </select>
                </div>

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

export class TabelaLivros extends Component{
        
    render(){
        return(
            <div>
            <table className="pure-table">
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Preco</th>
                  <th>Autor</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.lista.map(function(livro) {
                    return (
                      <tr key={livro.id}>
                        <td>{ livro.titulo }</td>
                        <td>{ livro.preco }</td>
                        <td>{ livro.autor.nome }</td>
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


export default class LivroBox extends Component{
  constructor() {
    super()  
    this.state = { lista: [], autores: []};
  }

  componentDidMount(){
    $.ajax({
      // url:"http://cdc-react.herokuapp.com/api/autores",
      url:"http://localhost:8080/api/livros",
      dataType: 'json',
      success:function(resposta){
        this.setState({lista: resposta});
      }.bind(this)
    });

    $.ajax({
        // url:"http://cdc-react.herokuapp.com/api/autores",
        url:"http://localhost:8080/api/autores",
        dataType: 'json',
        success:function(resposta){
          this.setState({autores: resposta});
        }.bind(this)
      });

    PubSub.subscribe('atualiza-lista-livros', function(topico, novaLista){
      this.setState({lista: novaLista});
    }.bind(this));
  }
    
  render(){
        return(
            <div>
              <div>
                  <div className="header">
                    <h1>Cadatro de Livros</h1>
                  </div>
                  <br />
                  <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores} />
                    <TabelaLivros lista={this.state.lista}/>
                </div>
              </div>
            </div>
        );
    }
}
