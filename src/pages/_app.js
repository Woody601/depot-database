import "@/styles/globals.css";
import { AuthProvider } from '@./lib/AuthContext';
;
import Navbar from "@/components/Navbar";
export default function App({ Component, pageProps }) {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <div className="pagescroll">
        <Component {...pageProps} />
        </div>
      </AuthProvider>
    </>
  );
}