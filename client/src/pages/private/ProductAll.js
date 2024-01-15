import React, { useEffect, useState } from "react";
import {
  apiGetAllPhieuXuat,
  apiGetAllPhieuNhap,
  apiGetProductsAdmin,
  apiGetAllTheKhos,
} from "../../apis";
import { Box, Modal } from "@mui/material";
import { useDispatch } from "react-redux";
import actionTypes from "../../store/actions/actionTypes";
import { format, set, subDays } from "date-fns";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Loading } from "../../components";
import { formatLocalTime } from "../../utils/fn";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};
const columns = [
  { field: "id", name: "ID", width: 90 },

  {
    field: "maHoaDon",
    name: "Ảnh sản phẩm",
    width: 150,
    editable: true,
  },
  {
    field: "quantityProduct",
    name: "Tên sản phẩm",
    width: 150,
    editable: true,
  },
  {
    field: "quantityProduct",
    name: "Nhãn hiệu",
    width: 150,
    editable: true,
  },
  {
    field: "createdAt",
    name: "Loại hàng",
    width: 150,
    editable: true,
  },
  {
    field: "createdAt",
    name: "Số lượng",
    width: 150,
    editable: true,
  },
  {
    field: "action",
    name: "Thao tác",
    width: 110,
    editable: true,
  },
];
const ProductAll = () => {
  const [data, setData] = useState(null);
  const [data1, setData1] = useState(null);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [dataModal, setDataModal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  console.log("dateRange", dateRange);
  const [keySearch, setKeySearch] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleRender = (id) => {
    console.log("id", id);
    // data.map((item) => {item.id === id && item.hoaDons.length > 0 && setDataModal(item.hoaDons)})
    // console.log('modal',dataModal)
    // console.log('modal1',dataModal1?.user)
    data.map((item) => {
      item.id === id && setDataModal(item.hoaDons);
    });
    console.log("modal", dataModal);
    handleOpen();
  };

  const handleChangePage = (event, newpage) => {
    setPage(newpage);
  };

  const handleRowsPerPage = (event) => {
    setRowPerPage(+event.target.value);
    setPage(0);
  };

  //   const fetchData = async () => {
  //     setLoading(true);
  //     if (!dateRange.startDate || !dateRange.endDate) {
  //       const currentDate = new Date();
  //       const endDate = currentDate.toISOString().slice(0, 16);
  //       const startDate = new Date(currentDate - 30 * 24 * 60 * 60 * 1000)
  //         .toISOString()
  //         .slice(0, 16);
  //       setDateRange({
  //         startDate,
  //         endDate,
  //       });
  //     }
  //     const response = await apiGetAllTheKhos({
  //       startDate: dateRange.startDate,
  //       endDate: dateRange.endDate,
  //     });
  //     setLoading(false);
  //     if (response.length > 0) setData(response);
  //     console.log("data123",response.map((item) => item)
  //     );
  //   };

  // const fetchData = async () => {
  //     setLoading(true);
  //     const response1 = await apiGetAllPhieuXuat();
  //     const response2 = await apiGetAllPhieuNhap();
  //     setLoading(false);
  //     const data = [ ...response1,...response2];
  //     console.log('data',data)

  //     if (dateRange.startDate || dateRange.endDate) {
  //       const start = new Date(dateRange.startDate);
  //       const end = new Date(dateRange.endDate) || new Date();
  //       const filterDate = data.filter((item) => {
  //         const itemDate = new Date(item.date);
  //         return itemDate >= start || itemDate <= end;
  //       });
  //       setData(filterDate);
  //     } else if (keySearch) {
  //       const filteredSearch = data.filter((item) => {
  //         return item.maHoaDon.toLowerCase().includes(keySearch.toLowerCase());
  //       });
  //       setData(filteredSearch);
  //     }else{
  //       setData(data);
  //     }
  // }

  // useEffect(() => {
  //     fetchData()
  // },[dateRange.startDate,dateRange.endDate,keySearch])

  const fetchDataTheKho = async () => {
    setLoading(true);
    if (!dateRange.startDate || !dateRange.endDate) {
      const currentDate = new Date();
      const endDate = currentDate.toISOString().slice(0, 16);
      const startDate = new Date(currentDate - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16);
      setDateRange({
        startDate,
        endDate,
      });
    }
    const response = await apiGetAllTheKhos({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
    setLoading(false);
    if (response.length > 0) setData(response);
    console.log(
      "data12345",
      response.map((item) => item)
    );
  };

  useEffect(() => { fetchDataTheKho()},[dateRange.startDate,dateRange.endDate])

  const fetchData = async () => {
    setLoading(true);
    const response = await apiGetProductsAdmin({ page: page });
    setLoading(false);
    const resData = response.productDatas;
    if (keySearch) {
      const filteredSearch = resData.rows.filter((item) => {
        return item.name.toLowerCase().includes(keySearch.toLowerCase());
      });
      console.log("filteredSearch", filteredSearch);
      setData1(filteredSearch);
    } else {
      setData(resData);
    }
    console.log("response123", data);
  };
  useEffect(() => {
    fetchData();
  }, [page, keySearch]);

  const handleStartDateChange = (e) => {
    setDateRange((prev) => ({
      ...prev,
      startDate: e.target.value,
    }));
  };

  const handleEndDateChange = (e) => {
    setDateRange((prev) => ({
      ...prev,
      endDate: e.target.value,
    }));
  };

  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center" }}>
      <h3 className="font-bold text-[30px] pb-2 ">Lịch sử</h3>
      <input
        type="text"
        className="bg-white text-gray-700 rounded-md py-2 px-4 w-full"
        placeholder="Tìm kiếm nhãn hiệu"
        onChange={(e) => setKeySearch(e.target.value)}
      />
      <div></div>
      {loading ? (
        <Loading />
      ) : (
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 850 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      style={{ backgroundColor: "black", color: "white" }}
                      key={column.field}
                    >
                      {column.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {data ? data.rows?.slice(page * rowPerPage, page * rowPerPage + rowPerPage).map((row, index) => {
                      return (
                        <TableRow hover key={row.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell><img src={row.thumb} alt="ảnh sản phẩm" className="h-[50px] object-contain"/></TableCell>
                          <TableCell>{row?.name}</TableCell>
                          <TableCell>{row?.brand}</TableCell>
                          <TableCell>{row?.catalog}</TableCell>
                          <TableCell>{row?.quantity}</TableCell>
                          <button
                             onClick={() => handleRender(row.id)}
                            className="py-2 px-4 mt-4 bg-green-600 rounded-md text-white font-semibold"
                          >
                            Xem chi tiết
                          </button>
                        </TableRow>
                      );
                    }) :<p>Không có dữ liệu</p>}  */}

                {data1
                  ? data1
                      ?.slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow hover key={row.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <img
                                src={row.thumb}
                                alt="ảnh sản phẩm"
                                className="h-[50px] object-contain"
                              />
                            </TableCell>
                            <TableCell>{row?.name}</TableCell>
                            <TableCell>{row?.brand}</TableCell>
                            <TableCell>{row?.catalog}</TableCell>
                            <TableCell>{row?.quantity}</TableCell>
                            <button
                              onClick={() => handleRender(row.id)}
                              className="py-2 px-4 mt-4 bg-green-600 rounded-md text-white font-semibold"
                            >
                              Xem chi tiết
                            </button>
                          </TableRow>
                        );
                      })
                  : data &&
                    data?.rows
                      ?.slice(page * rowPerPage, page * rowPerPage + rowPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow hover key={row.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <img
                                src={row.thumb}
                                alt="ảnh sản phẩm"
                                className="h-[50px] object-contain"
                              />
                            </TableCell>
                            <TableCell>{row?.name}</TableCell>
                            <TableCell>{row?.brand}</TableCell>
                            <TableCell>{row?.catalog}</TableCell>
                            <TableCell>{row?.quantity}</TableCell>
                            <button
                              onClick={() => handleRender(row.id)}
                              className="py-2 px-4 mt-4 bg-green-600 rounded-md text-white font-semibold"
                            >
                              Xem chi tiết
                            </button>
                          </TableRow>
                        );
                      })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 15, 20]}
            rowsPerPage={rowPerPage}
            page={page}
            count={data1 ? data1?.length : data?.count}
            component="div"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleRowsPerPage}
          ></TablePagination>
        </Paper>
      )}

      {dataModal && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
              Chi tiết phiếu
            </h1>
            <label htmlFor="startDate">Chọn ngày bắt đầu:</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleStartDateChange}
            />

            <label htmlFor="endDate">Chọn ngày kết thúc:</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleEndDateChange}
            />
            <div>Data</div>
            {/* {dataModal && (
              <>
                <Paper>
                  <TableContainer sx={{ maxHeight: 800 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>STT</TableCell>
                          <TableCell>Ảnh</TableCell>
                          <TableCell>Tên sản phẩm </TableCell>
                          <TableCell>Mã sản phẩm</TableCell>
                          <TableCell>Số lượng</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataModal
                          .slice(
                            page * rowPerPage,
                            page * rowPerPage + rowPerPage
                          )
                          .map((row, index) => {
                            return (
                              <TableRow key={row?.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  <img
                                    src={row.product.thumb}
                                    alt="ảnh sản phẩm"
                                    className="h-[50px] object-contain"
                                  />
                                </TableCell>
                                <TableCell>{row?.product?.name}</TableCell>
                                <TableCell>{row?.productId}</TableCell>
                                <TableCell>{row?.quantity}</TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div>
                    <TablePagination
                      rowsPerPageOptions={[10, 15, 20]}
                      rowsPerPage={rowPerPage}
                      page={page}
                      count={dataModal.length}
                      component="div"
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleRowsPerPage}
                    ></TablePagination>
                  </div>
                </Paper>
              </>
            )} */}
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default ProductAll;
