import Header from "../../Components/Header/Header";
import CreateUrlForm from "../../Components/CreateUrlForm/CreateUrlForm";

function LandingPage() {
  return (
    <div>
        <Header>
            <h1>Landing</h1>
            <CreateUrlForm />
        </Header>
    </div>
  );
}

export default LandingPage;