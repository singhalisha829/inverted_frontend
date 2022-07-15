import { createContext, useContext } from "react"

export const UserContext = createContext(null)

export const useUser = () => {
  return useContext(UserContext)
}

export const Ugh=(props)=>{
  return (
    <div>
      <div>{props.hell}</div>
    </div>
  )
}

export const WhyIs=(props) =>{
  return(
    <div>
      <div>{props.why}</div>
      <div style={{display:'flex'}}>
        <div>{props.not}?</div>
        <div>{props.}</div>
      </div>
    </div>
  )
}