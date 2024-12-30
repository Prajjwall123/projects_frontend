import hero from '../assets/hero.png';

const Hero = () => {
    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img
                    src={hero}
                    className="max-w-sm rounded-lg"
                    alt="Hero Illustration"
                />
                <div
                    className="p-10 skewed-container text-black font-sans"
                    style={{
                        backgroundColor: '#90A4AE',
                        borderRadius: '20px',
                        transform: 'skew(-10deg) translateX(-150px)',
                    }}
                >
                    <div style={{ transform: 'skew(10deg)' }}>
                        <h1 className="text-7xl font-bold">Browse..</h1>
                        <h1 className="text-7xl font-bold">Bid..</h1>
                        <h1 className="text-7xl font-bold">Build..</h1>
                        <p className="py-6 text-xl">
                            Discover projects you love, build the career you deserve.
                        </p>
                        <div className="flex gap-4">
                            <button className="btn bg-black text-white">I am a freelancer</button>
                            <button className="btn btn-outline">I am an enterprise</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
