import React, { useState, useEffect } from 'react';

import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import icon from './assets/register.png';

function App() {
  const baseUrl = 'https://localhost:7046/api/student';

  const [data, setData] = useState([]);
  const [updateDate, setUpdateData] = useState(true);

  const [modalIncluir, setModalIncluir] = useState(false);

  const [modalEditar, setModalEditar] = useState(false);

  const [modalExcluir, setModalExcluir] = useState(false);

  const [alunoSelecionado, setAlunoSelecionado] = useState({
    id: '',
    name: '',
    email: '',
  });

  const selecionarAluno = (aluno, opcao) => {
    setAlunoSelecionado(aluno);
    opcao === 'Editar' ? abrirFechalModalEditar() : abrirFechalModalExcluir();
  };

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  };

  const abrirFechalModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirFechalModalExcluir = () => {
    setModalExcluir(!modalExcluir);
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
        setUpdateData(true);
        abrirFecharModalIncluir();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoPut = async () => {
    await axios
      .put(`${baseUrl}/${alunoSelecionado.id}`, alunoSelecionado)
      .then((response) => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map((aluno) => {
          if (aluno.id === alunoSelecionado.id) {
            aluno.name = resposta.name;
            aluno.email = resposta.email;
          }
        });
        setUpdateData(true);
        abrirFechalModalEditar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoDelete = async () => {
    await axios
      .delete(`${baseUrl}/${alunoSelecionado.id}`)
      .then((response) => {
        setData(data.filter((aluno) => aluno.id !== response.data));
        setUpdateData(true);
        abrirFechalModalExcluir();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (updateDate) {
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateDate]);

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
                <button
                  className="btn btn-primary"
                  onClick={() => selecionarAluno(aluno, 'Editar')}
                >
                  Editar
                </button>{' '}
                <button
                  className="btn btn-danger"
                  onClick={() => selecionarAluno(aluno, 'Excluir')}
                >
                  Excluir
                </button>
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

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Aluno</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input
              type="text"
              className="form-group"
              readOnly
              value={alunoSelecionado && alunoSelecionado.id}
            />
            <br />
            <label>Nome: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="name"
              onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.name}
            />
            <br />
            <label>Email: </label>
            <input
              type="text"
              className="form-control"
              name="email"
              onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.email}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>
            Editar
          </button>{' '}
          <button
            className="btn btn-danger"
            onClick={() => abrirFechalModalEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirmar a exclusão do(a) aluno(a):
          {alunoSelecionado && alunoSelecionado.name}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => pedidoDelete()}>
            {' '}
            Sim{' '}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => abrirFechalModalExcluir()}
          >
            {' '}
            Não{' '}
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
