import React, { useState, useCallback, useEffect } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Container, Form, SubmitButton, List, DeleteButton } from './styled';
import { Link } from 'react-router-dom';

import api from '../../services/api';

export default function Main() {

  const [newRepo, setNewRepo] = useState('');
  const [repositorio, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert ] = useState(null);


  // Buscar
  useEffect(() => {
    const repoStorage = localStorage.getItem('repos');

    if(repoStorage){
      setRepositorios(JSON.parse(repoStorage)); 
    }
  }, [])

  // Salvar alteração
  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(repositorio))
  }, [repositorio]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    //Para não dar refresh na pagina
    
    async function submit() {
      setLoading(true); 
      setAlert(null);
    try {

      if(newRepo === ''){
        throw new Error('Você precisa indicar um repositorio!');
      }

      const response = await api.get(`repos/${newRepo}`);

      const hasRepo = repositorio.find(repo => repo.name === newRepo);

      if(hasRepo){
        throw new Error('Repositorio duplicado!'); 
      }

      const data = {
        name: response.data.full_name,
      }

      setRepositorios([...repositorio, data]);
      setNewRepo('');
    } catch (error) {
      setAlert(true);
      console.log(error)
      
    }finally{
      setLoading(false);
    }
  }

  submit();
  
}, [newRepo, repositorio]);

  function handleinputChange(e) {
    setNewRepo(e.target.value);
    setAlert(null);
    }

    const handleDelete = useCallback((repo) => {
      const find = repositorio.filter(r => r.name !== repo);
      setRepositorios(find);
    }, [repositorio]);

  return(
    <Container>
      <h1>
        <FaGithub size={25}/>
        Meus repositorios 
      </h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input 
        type="text" 
        placeholder="Adicionar repositorio"
        value={newRepo}
        onChange={handleinputChange}
        />

        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#fff" size={14}/>
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
          {repositorio.map(repo => (
            <li key={repo.name}>
              <span>
                <DeleteButton onClick={() => handleDelete(repo.name)}>
                  <FaTrash size={14} />
                </DeleteButton>
                {repo.name}
              </span>
              <Link to={
                `/repositorio/${encodeURIComponent(repo.name)}`
              }>
                <FaBars siza={20}/>
              </Link>
            </li>
          ))}
      </List>
    </Container>
  );
}