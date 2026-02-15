import { useState } from "react"

const Search = () => {
    const [query, setQuery] = useState('')

    const handleSearch = (event) => {
        setQuery(event.target.value);
    }

  return (
    <div>
      <input type="text" value={query} onChange={handleSearch} />
    </div>
  )
}

export default Search
