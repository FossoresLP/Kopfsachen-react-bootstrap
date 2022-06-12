import {React , useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Nav from './navigator'
import Tagebuch from './tagebuch'
import Header from './header'
import Missing from './missing'
import Wiki from './wikiList'
import Wikientry from './wikientry'
import App from '../App'
import Starkmacher from './starkmacher';
import NeueStarkmacher from './neueStarkmacher';
import Reframing from './starkmacher/reframing';
import SicherheitsnetzController from './starkmacher/SicherheitsnetzController';
import SozialeUnterstuetzungController from './starkmacher/sozialeUnterstuetzungController';
import  Help  from './help';
import Profil from './profil';

//https://www.flatuicolorpicker.com/colors/sauvignon/

 function GetWikiData(){
    const [wikii, setWiki] = useState([])}

const Routes = () => {

const [wikii, setWiki] = useState([])

useEffect(() => {
  fetch('http://127.0.0.1:4010/wiki/quiadfd')
  .then(res => res.json())
  //.then(x => x.filter(a => a.title !== ''))
  //.then(x => console.log(x))
  .then(data => setWiki(data))
  .catch(
    (error) => {
      setWiki([]);
    }
  )

}, [])


// const data = GetWikiData();
const data = [];

const routes = [{
  path: ["/", "/home"],
  component: <App/>,
  color: "#f3f0f8",
  text: "Herzlich Willkommen!",
  img: "./logoBig.png"
},
{
  path: "/tagebuch",
  component: <Tagebuch/>,
  color: "#f6efe9",
  text: "Stimmungstagebuch",
  img: "./tagebuch.svg"
},
/* {
  path: "/wiki",
  component: <Wiki list={wikii.filter(a => a.title !== '')} />,
  color: "#f6efe9",
  text: "Wiki",
  img: "./tagebuch.svg"
}, */
{
  path: "/starkmacher",
  component: <Starkmacher/>,
  color: "#eefcf5",
  text: "Meine Starkmacher",
  img: "./logoBig.png"
},
{
  path: "/neueStarkmacher",
  component: <NeueStarkmacher/>,
  color: "#eefcf5",
  text: "Neue Starkmacher",
  img: "./logoBig.png"
},
{
  path: "/starkmacher/reframing",
  component: <Reframing/>,
  color: "#eefcf5",
  text: "Reframing",
  img: "./logoBig.png"
},
{
  path: "/starkmacher/SozialeUnterstuetzung",
  component: <SozialeUnterstuetzungController />,
  color: "#eefcf5",
  text: "Soziale Unterstützung",
  img: "./logoBig.png"
},
  {
  path: "/starkmacher/sicherheitsnetz",
  component: <SicherheitsnetzController />,
  color: "#f6efe9",
  text: "Sicherheitsnetz",
  img: "./logoBig.png"
},
{
  path: "/notfall",
  component: <Help />,
  color: "rgb(225 116 135)",
  text: "Externe Hilfe",
  img: "./notfall.svg"
},
{
  path: "/profil",
  component: <Profil />,
  color: "#eefcf5",
  text: "Profil",
  img: "./tagebuch.svg"
},
{
  path: "*",
  component: <Missing/>,
  color: "#eefcf5",
  text: "Komponente kommt bald!",
  img: "./logoBig.png"
}]

    return (
    <Router>
      <Nav/>
      <Switch>
        {
          wikii.filter(a => a.id !== '').map(wikiEntry => {
            console.log(`/wiki/${wikiEntry.id.replace(/\s+/g, '')}`)
            return(
                <Route key={wikiEntry.id} path={`/wiki/${wikiEntry.id.replace(/\s+/g, '')}`}>
                
                  <Header color="#f6efe9" text={wikiEntry.title} img=""/>
                  <Wikientry object={wikiEntry} />
                </Route>
              )
          })
        }

        {
          routes.map((route, index) => {
            return(
              <Route key={index} exact path={route.path}>
                <Header color={route.color} text={route.text} img={route.img}/>
                {route.component}
              </Route>
            )
          })
        }

      </Switch>
    </Router>
    )
}

export default Routes
