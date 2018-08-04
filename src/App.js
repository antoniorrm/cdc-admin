import React, { Component } from 'react';

import './css/pure-min.css';
import './css/side-menu.css';
import './App.css';

class App extends Component {

  constructor() {
    super()
    this.state = { lista: [{ nome: 'Antonio', email: 'antonio@gmail.com', senha: 'admin' },
    { nome: 'Antonio2', email: 'antonio@gmail.com', senha: 'admin' }] }
    
  }


  render() {
    return (
      <div id="layout">

        <a href="#menu" id="menuLink" className="menu-link">

          <span></span>
        </a>

        <div id="menu">
          <div className="pure-menu">
            <a className="pure-menu-heading" href="">Company</a>

            <ul className="pure-menu-list ">
              <li className="pure-menu-item pure-menu-link">Home</li>
              <li className="pure-menu-item pure-menu-link">Autor</li>
              <li className="pure-menu-item pure-menu-link">Livro</li>
              {/* <li className="pure-menu-item"><Link to="/" className="pure-menu-link">Home</Link></li>
              <li className="pure-menu-item"><Link to="/autor" className="pure-menu-link">Autor</Link></li>
              <li className="pure-menu-item"><Link to="/livro" className="pure-menu-link">Livro</Link></li> */}


            </ul>
          </div>
        </div>

        <div id="main">
          <div className="header">
            <h1>Cadastro de Autores</h1>
          </div>
        </div>
        <br />
        <div className="content" id="content">
          <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned">
              <div className="pure-control-group">
                <label htmlFor="nome"> Nome </label>
                <input id="nome" type="text" name="nome"/>
              </div>
              <div className="pure-control-group">
                <label htmlFor="email"> Email </label>
                <input id="email" type="email" name="email"/>
              </div>
              <div className="pure-control-group">
                <label htmlFor="senha"> Senha </label>
                <input id="senha" type="password" name="senha"/>
              </div>
              <div className="pure-control-group">
                <label></label>
                <button type="submit" className="pure-button pure-button-primary">
                  Gravar
                    </button>
              </div>
            </form>
          </div>
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
                  this.state.lista.map(function (autor) {
                    return (
                      <tr>
                        <td>{ autor.nome }</td>
                        <td>{ autor.email }</td>
                      </tr>
                    );
                  })
                }

              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
