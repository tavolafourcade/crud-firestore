import {useState, useEffect} from 'react'
import {firebase} from './firebase'

function App() {
  const [tareas, setTareas] = useState([])
  useEffect(() => {
    const obtenerDatos = async () => {
      try{
        // llamando a firestore
        const db = firebase.firestore()
        const data = await db.collection('tareas').get()
        console.log(data.docs)

        const arrayData = data.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setTareas(arrayData)
      }catch (error) {
        console.log('Error',error)
      }
    }

    obtenerDatos()
  },[])
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {
              tareas.map(tarea => (
                <li className="list-group-item" key={tarea.id}>
                  {tarea.name}
                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-md-6">
          Formulario
        </div>
      </div>
    </div>
  );
}

export default App;
