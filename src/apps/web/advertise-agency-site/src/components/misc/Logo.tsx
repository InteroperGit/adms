import Link from "next/link";
import { GiButterfly } from "react-icons/gi";

export default function Logo() {
    return (
        <Link
            href="/"
            className={"inline-flex items-center text-xl font-bold text-primary mr-auto"}>
                <GiButterfly className="text-blue-500 text-2xl mr-2" />
                <span className={"text-orange-500"}>Рекла</span>
                <span className={"text-blue-500"}>Мастер</span>
        </Link>
    );
}