import axios from "axios";
import { useEffect, useState } from "react"

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(false);


    const FetchData = async () => {

        setIsPending(true);

        try {

            const response = await axios.get(url, {
                withCredentials: true
            });


            setData(response.data);


        } catch (err) {
            console.log(err)

            setError(err);
        }
        setIsPending(false);

    }
    useEffect(() => {

        FetchData()
    }, [url]);


    const refetch = async () => {

        setIsPending(true);
        try {
            const response = await axios.get(url, {
                withCredentials: true
            });
            if (!response.data.success == true) {
                console.log(response.data, 'fetchedc here')


            }
            setData(response.data);


        } catch (err) {
            setError(err);
        }
        setIsPending(false);
    }



    return { data, isPending, error, refetch }
}
export default useFetch