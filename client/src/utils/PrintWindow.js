const PrintWindow = (title, info, benAdd, benBdd, thead, tbody) => {
  const mywindow = window.open("", "PRINT", "height=1123px,width=794px");

  mywindow.document.write(`<!doctype html>
  <html lang="en">
    <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <body>
        <div class="container ">
            <div class="d-flex flex-column">
              <div class="mt-3">
                <h4>KHÁCH SẠN MINH LONG</h4>
                <p>
                    <b>Địa chỉ</b>: Số 11 khu A, Tập thể Quân Đội, Cầu Niệm,đường Trần Nguyên Hãn, quận Lê Chân, Hải Phòng
                  </p>
                  <p style="margin-top:-15px"><b>SĐT:</b> 1800 6145 - 0904 579 079 
                </p> 
                
              </div>   
            </div>
  
          <h2 class="text-center my-4 mr-2">${title}</h2>
  
            ${info}
            <p class="text-right mt-4">Đơn vị: đồng</p>
    
            <table class="table" style="border:2px solid #191919" >
                <thead>
                <tr style="border-bottom:2px solid #191919">
                    ${thead}
                </tr>
                </thead>
                <tbody>
                ${tbody}
                </tbody>
            </table>
    
               
            <div class="row mt-5"> 
              <div class="col-2"></div>
              <div class="col-3">
                  <p>${benAdd}</p>
              </div>
              <div class="col-2"></div>
              <div class="col-3">
                  <p>${benBdd}</p>
              </div>
              <div class="col-2"></div>
            </div>
        </div>
   </body>
  </html>`);

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
};

export default PrintWindow;
