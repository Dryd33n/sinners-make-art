import AboutMeForm from "./components/home_edit"
import Header from "../components/header"
import NavTree from "./components/nav_tree"

export default function Home() {

  return (<>
    <Header mainText="ADMIN PANEL"/>
    
    <div className="flex">
    <div className="basis-1/2 px-5 py-10">
    <NavTree />
    </div>

    <div className="basis-1/2 px-5 py-10">
    <AboutMeForm />
    </div>

    </div>


    

    {/*MANAGE PROJECTS*/}

    {/*MANAGE CATEGORIES*/}

    {/*MANAGE SELECTED CATEGORY CONTENT*/}
    </>
  )
}
