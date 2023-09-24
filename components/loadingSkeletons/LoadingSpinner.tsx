import {Skeleton} from "@/components/ui/skeleton"


export default function LoadingSpinner(): JSX.Element {
    return (
        <>
            <Skeleton className="w-[100px] h-[20px] rounded-full"/>
        </>
    )
}