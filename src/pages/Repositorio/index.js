import React, { useState, useEffect } from 'react';
import { Container } from './styled';
import api from '../../services/api';


export default function Repositorio({match}) {

  useEffect(() => {

    async function load() {
      const nomeRepo = decodeURIComponent(match.params.Repositorio);
      
      await Promise.all([
        api.get(`/repos/${nomeRepo}`)
      ]);
      console.log(nomeRepo);
      
    }

    load();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <Container>

    </Container>
  );
}