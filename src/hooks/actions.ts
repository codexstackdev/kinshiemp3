const handleError = (err: any) => {
    return err instanceof Error ? err.message : "Something went wrong";
}

export const searchMusic = async(query:string) => {
    try {
        const req = await fetch(`${process.env.EXPO_PUBLIC_MUSIC_API}${query + " audio"}`);
        const data = await req.json();
        if(!data) return { success: false, message: `No result for ${query}`};
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}