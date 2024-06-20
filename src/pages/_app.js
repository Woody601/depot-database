// _app.js
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <div className="pagescroll">
        <Component {...pageProps} />
      </div>
    </>
  );
}
