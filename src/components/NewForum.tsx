import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useState } from "react";

const NewGroup = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        const value = e.target.value;
        setSearchTerm(value);
    };
    const handleToggleSearch = () => {
        setShowSearch((prevState) => !prevState);
    };
    return (
        <>
            <div className="flex justify-between gap-2 px-3 py-4">
                <div className="flex items-center gap-4">
                    <button onClick={handleToggleSearch}>
                        <ArrowBackIosOutlinedIcon />
                    </button>
                    {showSearch ? (
                        <input
                            onChange={handleChange}
                            id="search"
                            name="search"
                            autoComplete="true"
                            placeholder="type to search ..."
                            className="w-full h-[32px] focus:outline-none"
							autoFocus
                        />
                    ) : (
                        <div className="h-[32px] flex flex-col justify-center">
                            <p>New Forum</p>
                            <p className="text-sm">Add humans</p>
                        </div>
                    )}
                </div>
                {!showSearch && (
                    <button onClick={handleToggleSearch}>
                        <SearchOutlinedIcon />
                    </button>
                )}
            </div>
            <div>{searchTerm}</div>
        </>
    );
};

export default NewGroup;
