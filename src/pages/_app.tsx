import '../../styles/globals.scss'
import { AppProps } from 'next/app';
import { AutenticarProvider } from '../contexts/AutenticarContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/ui/footer/index';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AutenticarProvider>
      <header>

      </header>
      <main>
        <Component {...pageProps} />
      </main>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AutenticarProvider>
  )
}

MyApp.suppressHydrationWarning = true;

export default MyApp;