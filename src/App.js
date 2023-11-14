import ReactDOM from "react-dom/client";
import Layout from "./Layout/Layout/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Worklist } from "./Component/Page/Use Reducer/API/Collectionlist";
import { Datalist } from "./Component/Page/Use State/Api/List";
import Workform from "./Component/Page/Use Reducer/API/Collectionform";
import { Dataform } from "./Component/Page/Use State/Api/Dataform";
import Home from "./Component/Page/Home/Home";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Usecontextform from "./Hooks/Context/API/Usecontextform";
import Usecontextlist from "./Hooks/Context/API/Usecontextlist";
import { GlobalProvider } from "./Hooks/Context/API/Contextstate";
import Reduxform from "./Component/Page/Redux/Reduxcomponent/Reduxform"
import Reduxtable from "./Component/Page/Redux/Reduxcomponent/Reduxtable"
import SagaForm from "./Component/Page/Saga/Sagaform";
import Sagalist from "./Component/Page/Saga/Sagalist"

function App() {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="Use State" element={<Datalist />} />
            <Route path="/table" element={<Datalist />} />
            <Route path="/usereducer" element={<Workform />} />
            <Route path="/usereducer/:id" element={<Workform />} />

            <Route path="/dataform" element={<Dataform />} />
            <Route path="/dataform/:id" element={<Dataform />} />

            <Route exact path="/data" element={<list />} />
            <Route exact path="/ReducerApiList" element={<Worklist />} />
            <Route exact path="/ReducerApiList" element={<Worklist />} />
            <Route exact path="/Usecontextform" element={<Usecontextform />} />
            <Route
              exact
              path="/Usecontextform/:id"
              element={<Usecontextform />}
            />
            <Route exact path="/Usecontextlist" element={<Usecontextlist />} />
            <Route exact path="/Usecontextlist" element={<Usecontextform />} />

            <Route exact path="/Reduxform" element={<Reduxform />} />
            <Route exact path="/Reduxform/:id" element={<Reduxform />} />
            <Route exact path="/Reduxtable" element={<Reduxtable />} />

            <Route exact path="/Sagalist" element={<Sagalist />} />
            <Route exact path="/Sagaform" element={<SagaForm />} />
            <Route exact path="/Sagaform/:id" element={<SagaForm />} />
          </Route>
        </Routes>
        <ToastContainer />
      </GlobalProvider>
    </BrowserRouter>
  );
}
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);
export default App;
