import { useState } from "react";

import Header from "../../components/Header";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ItemList from "../../components/ItemList";

import background from '../../assets/gitlogo.png';
import './styles.css'

function App() {

  const [currentUser, setCurrentUser] = useState(null);
  const [repos, setRepos] = useState(null);

  async function handleGetData(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const requestData = await fetch(`https://api.github.com/users/${data.usuario}`);
    
    if (requestData.status === 200) {
      const userData = await requestData.json();

      const {avatar_url, html_url, name, bio, login} = userData;
      setCurrentUser({avatar_url, html_url, name, bio, login})

      const reposData = await (await fetch(`https://api.github.com/users/${data.usuario}/repos`)).json();

      if(reposData.length) {
        setRepos(reposData);
      } else {
        setRepos('Invalid')
      }
    } else if (requestData.status === 404) {
      setCurrentUser('Invalid');
      setRepos(null);
    } else {
      setCurrentUser(null);
      setRepos(null);
      console.log('Um erro ocorreu!')
    }
  }

  return (
    <div>
      <Header />

      <div className="conteudo">
        <img src={background} alt="Logo do Github" className="background"/>

        <div className="info">
          <form className="searchBar" id="searchBar" onSubmit={handleGetData}>
            <Input name="usuario" placeholder="@username"/>              
            <Button text="Buscar" type='submit'/>  
          </form>

          {currentUser ?
            currentUser === 'Invalid' ? <h2 className="errorUser">Usuário não encontrado!</h2> : 
            (
              <>
              <div className="perfil">
                <img 
                  src={currentUser.avatar_url} alt="Imagem de perfil do github" className="profile"
                />
            
                <div>
                  <h3><a href={currentUser.html_url} target='_blank' rel='noreferrer'>{currentUser.name}</a></h3>
                  <span>{currentUser.login}</span>
                  <p>{currentUser.bio || 'Bio não definida'}</p>
                </div>
              </div>
              <hr />
              </>
            )
          : null}

          {repos ? 
            repos === 'Invalid' ? <h3 className="errorRepo">Este usuário não possui nenhum repositório público!</h3> : 
            (
              <>
              <div>
                <h4 className="repositorio">Repositórios</h4>
                {repos.map((repo) => (
                  <ItemList 
                    title={repo.name}
                    link={repo.html_url}
                    description={repo.description}
                    key={repo.name}
                  />
                ))}
              </div>
              </>           
            ) : null}

        </div>
      </div>

    </div>
  )
}

export default App;
