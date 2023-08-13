import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

const Landing = () => {
    return (
        <Container>
            <div className="flex md:flex-row flex-col items-center justify-center sm:justify-between px-5 gap-5">
                <div className="space-y-5">
                    <h2 className="font-extrabold text-5xl drop-shadow-md">Your tasks made easier</h2>
                    <p className="text-xl">Organize everything from daily chores to big projects - <span className="font-bold">for free.</span></p>
                    <Link className="btn btn-primary normal-case rounded" href="/sign-up">Register now!</Link>
                </div>
                <div>
                    <Image src="/landing1.png" height={600} width={600} alt="landing image" quality={100} />
                </div>
            </div>
            <div className="flex md:flex-row flex-col items-center justify-center sm:justify-between px-5 gap-5">
                <div className="order-last md:order-first">
                    <Image src="/landing2.png" height={600} width={600} alt="landing image" quality={100} />
                </div>
                <div className="space-y-5">
                    <h3 className="font-extrabold text-4xl drop-shadow-md">Boost your productivity</h3>
                    <p className="text-xl">Achieve your objectives, work with your team, meet those deadlines.</p>
                </div>
            </div>
            <div className="flex md:flex-row flex-col items-center justify-center sm:justify-between px-5 gap-5">
                <div className="space-y-5">
                    <h3 className="font-extrabold text-4xl drop-shadow-md">Overview</h3>
                    <p className="text-xl">Keep everything in one place with <span className="font-bold">workspaces</span> - you can create as many as you need!</p>
                    <p className="text-xl">Manage your workflow with customizable <span className="font-bold">boards</span>.</p>
                    <p className="text-xl">Track your progress with <span className="font-bold">lists</span> by moving <span className="font-bold">tasks</span> between them.</p>
                    <p className="text-xl">Focus on getting things done, <span className="font-bold">mytaskr</span> does the rest.</p>
                </div>
                <div>
                    <Image src="/overview.png" height={900} width={900} alt="landing image overview" quality={100} />
                </div>
            </div>
            <div className="flex md:flex-row flex-col items-center justify-center sm:justify-between px-5 gap-5">
                <div className="order-last md:order-first">
                    <Image src="/landing3.png" height={600} width={600} alt="landing image overview" quality={100} />
                </div>
                <div className="space-y-5">
                    <h3 className="font-extrabold text-4xl drop-shadow-md">Get started</h3>
                    <p className="text-xl">Join today and enjoy all of <span className="font-bold">mytaskr</span> features for free.</p>
                    <Link className="btn btn-primary normal-case rounded" href="/sign-up">Go!</Link>
                </div>
            </div>
        </Container>

    )
}

export default Landing;