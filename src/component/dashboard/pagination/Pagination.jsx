import { useState } from "react";
import ReactPaginate from "react-paginate";
import "./Pagination.css"

export default function Pagination({ itemsPerPage , data ,setPage ,total }) {

    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = data.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(total / itemsPerPage);

    return (
        <div>
        <div className="pagination-container">
      <ReactPaginate
        breakLabel="..."
        nextLabel=" >>"
        previousLabel="<< "
        pageRangeDisplayed={2}
        pageCount={pageCount}
        renderOnZeroPageCount={null}
        containerClassName="custom_pagination" 
        activeClassName="active"
        onPageChange={(e)=>setPage( e.selected +1)}
      />
    </div></div>
    
    );
  }


