import "../scss/main.scss"
import List from "./components/list"
import Synapse from "./components/synapse"
import Tabs from "./components/tabs"

window.onload = () => {
    new Tabs()
    new List()
    new Synapse()
}