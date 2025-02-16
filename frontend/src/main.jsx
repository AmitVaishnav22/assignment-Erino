import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import {store} from './store/store.js'
import ExpenseList from './pages/Expenses.jsx'
import { Provider } from 'react-redux'

const router=createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/login",
        element:(
          
            <Login/>
        ),
      },
      {
        path:"/signup",
        element:(
            <Register/>
        ),
      },
      {
        path:"/dashboard",
        element:(
          <ExpenseList/>
        ),
      },
     
    ]

  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
