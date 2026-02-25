import Hero from './components/hero/Hero';
import FormSearch from './components/form-search/FormSearch';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer.tsx';

function App() {
    return (
        <>
            <div className='min-h-screen flex flex-col'>
                <div className='mx-auto w-[95%] md:w-[50%] flex flex-col flex-1'>
                    <Navbar />
                    <div className='flex flex-col flex-1 justify-center'>
                        <Hero />
                        <FormSearch />
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}

export default App;
