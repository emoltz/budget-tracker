import Expenses from "@/components/Expenses";

export default function page() {
    const fakeData = [
        {
            avatar: 'https://fakeavatar.com/avatar1.png',
            name: 'John Doe',
            email: 'john.doe@example.com',
            job: 'Software Engineer',
            id: '1',
        },
        {
            avatar: 'https://fakeavatar.com/avatar2.png',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            job: 'Product Manager',
            id: '2',
        },
        {
            avatar: 'https://fakeavatar.com/avatar2.png',
            name: 'Crunchy',
            email: "j@gmail.com",
            job: 'Product Manager',
            id: '3',
        }
    ];


    return (
        <>
            <div
                className={"text-2xl font-bold text-gray-800"}
            >
                <Expenses
                    data={fakeData}
                />
            </div>

        </>
    )
}