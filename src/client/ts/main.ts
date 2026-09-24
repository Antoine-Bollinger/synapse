import "../scss/main.scss"
import Rows from "./components/rows"
import Synapse from "./components/synapse"
import Tabs from "./components/tabs"

window.onload = () => {
    new Tabs()
    new Rows()
    new Synapse()
}