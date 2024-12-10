import AboutMeForm from "./components/home_edit"
import Header from "../components/header"
import NavTree from "./components/nav_tree"

export default function Home() {

  return (<>
    <Header mainText="ADMIN PANEL"/>
    



    <div className="my-5">
      <AboutMeForm />
    </div>

    <div className="my-5 mx-4">
      <NavTree />
    </div>
  


    

    {/*MANAGE PROJECTS*/}

    {/*MANAGE CATEGORIES*/}

    {/*MANAGE SELECTED CATEGORY CONTENT*/}
    </>
  )
}
