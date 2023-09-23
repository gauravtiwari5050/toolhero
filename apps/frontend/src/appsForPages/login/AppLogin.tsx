import "../../assets/app.css";
import Navigation from "../../components/Navigation";
declare global {
  interface Window {
    APP: string;
  }
}

function App() {
  return (
    <>
      <div className="mx-auto max-w-7xl sm:py-0 lg:py-4">
        {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
        <div className="mx-auto max-w-4xl">
          {/* Content goes here */}
          <Navigation></Navigation>
          <div className="overflow-hidden rounded-sm bg-gray-200 border-t-[16px] border-gray-600 my-4">
            <h1>Hello world!</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
