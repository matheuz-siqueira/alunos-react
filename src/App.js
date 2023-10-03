import React, { useState, useEffect } from 'react';

import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import icon from './assets/register.png';

function App() {
  const baseUrl = 'https://localhost:7046/api/student';

  const [data, setData] = useState([]);

  const [modalIncluir, setModalIncluir] = useState(false);

  const [alunoSelecionado, setAlunoSelecionado] = useState({
    id: '',
    name: '',
    email: '',
  });

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlunoSelecionado({
      ...alunoSelecionado,
      [name]: value,
    });
    console.log(alunoSelecionado);
  };

  const pedidoGet = async () => {
    await axios
      .get(`${baseUrl}/get-all`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoPost = async () => {
    delete alunoSelecionado.id;
    await axios
      .post(`${baseUrl}/create`, alunoSelecionado)
      .then((response) => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    pedidoGet();
  }, []);

  return (
    <div className="aluno-container">
      <br />
      <h3>Cadastro de Alunos</h3>
      <header>
        <img src={icon} alt="cadastro" />
        <button
          className="btn btn-success"
          onClick={() => abrirFecharModalIncluir()}
        >
          Incluir novo Aluno
        </button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Operação</th>
          </tr>
        </thead>

        <tbody>
          {data.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.name}</td>
              <td>{aluno.email}</td>
              <td>
                <button className="btn btn-primary">Editar</button>{' '}
                <button className="btn btn-danger">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Alunos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label> <br />
            <input
              type="text"
              className="form-control"
              name="name"
              onChange={handleChange}
            />
            <br />
            <label>Email: </label> <br />
            <input
              type="text"
              className="form-control"
              name="email"
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>
            Incluir
          </button>{' '}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalIncluir()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
