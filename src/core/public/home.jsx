import React from 'react';
import Navbar from '../../components/navbar';
import Hero from '../../components/hero';
import Footer from '../../components/footer';
import Card from '../../components/card';
import SearchBar from '../../components/SearchBar';


function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <div className="text-5xl font-sans font-bold bg-base-200 text-center">
                Explore Projects:
            </div>
            <SearchBar />
            <div className="bg-base-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                <div><Card /></div>
                <div><Card /></div>
                <div><Card /></div>

                <div><Card /></div>
                <div><Card /></div>
                <div><Card /></div>
            </div>

            <Footer />
        </>
    );
}

export default Home;
