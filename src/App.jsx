import {useState, useEffect} from 'react'
import {firebase} from './firebase'

function App() {
  const [tareas, setTareas] = useState([])
  const [tareaForm, setTareaForm] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [id, setId] = useState('')

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

  const agregar = async (e) => {
    e.preventDefault()
    if(!tareaForm.trim()){
      console.log('Está vacío')
      return
    // Agregando tareas a Firebase
    }
    try {
      const db = firebase.firestore()
      const nuevaTarea = {
        name: tareaForm,
        fecha: Date.now()
      }
      const data = await db.collection('tareas').add(nuevaTarea)

      setTareas([
        ...tareas,
        {...nuevaTarea, id: data.id} // Al colocar esto estamos colocando el name y la fecha implicitamente
      ])
      setTareaForm('')
    } catch(error) {
      console.log(error)
    }
    console.log(tareaForm)
  }

  const eliminar = async (id) =>{
    try {
      const db = firebase.firestore()
      await db.collection('tareas').doc(id).delete()

      // Vamos a filtrar cuando tarea.id sea distinto al id que pasamos como parametro
      // Si es igual lo va a retirar
      const arrayFiltrado = tareas.filter(tarea => tarea.id !== id)
      setTareas(arrayFiltrado)
    } catch(error) {
      console.log(error)
    }
  }

  const activateEdition = (tarea) => {
    setEditMode(true)
    setTareaForm(tarea.name)
    setId(tarea.id)
  }

  const editar =  async (e) => {
    e.preventDefault()
    if(!tareaForm.trim()){
      console.log('Está vacío')
      return
    }
    try{
      const db = firebase.firestore()
      // Con update no necesitamos pasar todo el objeto sino solo el campo a utilizar
      await db.collection('tareas').doc(id).update({
        name: tareaForm
      })
      // Devolvemos un objeto que se va a guardar en el array editado
      // Si el id no coincide devolvemos el item sin modificación
      const arrayEditado = tareas.map(item => (
        item.id === id ? {
          id: item.id,
          fecha: item.fecha,
          name: tareaForm
        } : item
      ))
      setTareas(arrayEditado)
      setEditMode(false)
      setTareaForm('')
      setId('')

    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            <h3>Lista de tareas</h3>            
            {
              tareas.map(tarea => (
                <li className="list-group-item" key={tarea.id}>
                  {tarea.name}
                  <button className="btn btn-danger btn-sm float-right"
                  onClick={() => eliminar(tarea.id)}>Eliminar</button>
                  <button 
                    className="btn btn-warning btn-sm float-right mr-2"
                    onClick={()=> activateEdition(tarea)}
                    >Editar</button>

                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-md-6">
          <h3>
            {
            editMode? 'Editar Tarea': 'Agregar Tarea'
          }
          </h3>
          <form onSubmit={editMode ? editar : agregar}>
            <input 
            type="text"
            placeholder='Ingrese tarea'
            className='form-control mb-2'
            onChange={e => setTareaForm(e.target.value)} 
            value={tareaForm}/>
            <button
              className={
                editMode? "btn btn-warning btn-block" : "btn btn-dark btn-block"
              }
              type='submit'>
                {editMode? 'Editar': 'Agregar'}
              </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
