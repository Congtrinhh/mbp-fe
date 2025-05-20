Quy định:
Ảnh đầu vào phải đủ 4 góc rõ ràng hoặc đủ các bộ phận chính của một CMT như ảnh, quốc huy, tiêu đề.
Các trường thông tin phải rõ ràng, so sánh khi mắt người có thể đọc được dễ dàng, không tẩy xoá, hay bị nhoè nước
Ảnh đầu vào không vượt quá 5 MB và độ phân giải tối thiểu khoảng 640x480 để đảm bảo tỉ lệ đọc chính xác
Tỉ lệ diện tích Chứng minh thư hoặc Căn cước công dân phải chiếm tối thiểu ¼ tổng diện tích ảnh trở lên

Request
Request Url
POST https://api.fpt.ai/vision/idr/vnm/

Request Headers
Tham số Yêu cầu Mặc định Mô tả
api_key Có api_key của bạn ( lấy từ console.fpt.ai )
Request Body
FormData chứa ảnh cần nhận dạng

Tham số Yêu cầu Mô tả
image Có
Sample Request
curl -X POST https://api.fpt.ai/vision/idr/vnm/ -H "api-key: xxxxxx" -F "image=@path/to/image"

Response
JSON
{
"errorCode" : x,
"errorMessage" : "xxxx",
"data" : [xxxx]
}

Hệ thống có khả năng trích xuất tất cả các loại thông tin có trên các loại CMT cũ/mới hoặc CCCD của Việt Nam (phần thông tin về đặc điểm nhận dạng ở mặt sau chỉ được trả về nếu có yêu cầu riêng từ khách hàng). Hệ thống phân chia kết quả trả về thành 4 loại: CMT cũ mặt trước/sau và CCCD mặt trước/sau (CMT loại mới được xếp cùng loại với CCCD). Sau khi gửi request thành công, hệ thống sẽ trả về một file json bao gồm thông tin dạng text trên CMT sử dụng format như ở bên.

errorCode: giá trị bằng 0 nếu request thành công không có lỗi xảy ra
errorMessage: giá trị bằng string rỗng nếu request thành công không có lỗi xảy ra
data: bao gồm các trường thông tin có trên ảnh CMT nếu request thành công không có lỗi xảy ra, trả về danh sách rỗng [] nếu xảy ra lỗi (những trường thông tin không có sẽ có giá trị "N/A"). Ngoài ra, đi kèm với các trường thông tin là chỉ số probability cho biết mức độ đáng tin cậy của kết quả trả về. (Chi tiết các lỗi có thể xảy ra bao gồm cả errorCode và errorMessage xem ở phần Errors))

Căn cước công dân - mặt trước
{
"errorCode" : 0,
"errorMessage" : "",
"data": [
{
"id": "xxxx",
"id_prob": "xxxx",
"name": "xxxx",
"name_prob": "xxxx",
"dob": "xxxx",
"dob_prob": "xxxx",
"sex": "xxxx",
"sex_prob": "xxxx",
"nationality": "xxxx",
"nationality_prob": "xxxx",
"home": "xxxx",
"home_prob": "xxxx",
"address": "xxxx",
"address_prob": "xxxx",
"address_entities": {
"province": "xxxx",
"district": "xxxx",
"ward": "xxxx",
"street": "xxxx"
},
"doe": "xxxx",
"doe_prob": "xxxx",
"type": "xxxx"
}
]
}

Căn cước công dân - mặt sau
{
"errorCode" : 0,
"errorMessage" : "",
"data": [
{
"religion_prob": "N/A",
"religion": "N/A",
"ethnicity_prob": "N/A",
"ethnicity": "N/A",
"features": "xxxx",
"features_prob": "xxxx",
"issue_date": "xxxx",
"issue_date_prob": "xxxx",
"issue_loc_prob": "N/A",
"issue_loc": "N/A",
"type": "xxxx"
}
]
}

Errors:
Phần này bao gồm các lỗi thường gặp và có thể xử lý bởi hệ thống, messages được trả về rõ ràng và cụ thể mục đích nhằm chỉ thị cho users sử dụng API một cách chính xác nhất.
Hệ thống sử dụng các error code như sau:
Error Code Ý nghĩa
0 No error -- Không có lỗi
1 Invalid Parameters or Values! -- Sai thông số trong request (ví dụ không có key hoặc ảnh trong request body).
2 Failed in cropping -- CMT trong ảnh bị thiếu góc nên không thể crop về dạng chuẩn.
3 Unable to find ID card in the image -- Hệ thống không tìm thấy CMT trong ảnh hoặc ảnh có chất lượng kém (quá mờ, quá tối/sáng).
5 No URL in the request -- Request sử dụng key image_url nhưng giá trị bỏ trống.
6 Failed to open the URL! -- Request sử dụng key image_url nhưng hệ thống không thể mở được URL này.
7 Invalid image file -- File gửi lên không phải là file ảnh.
8 Bad data -- File ảnh gửi lên bị hỏng hoặc format không được hỗ trợ.
9 No string base64 in the request -- Request sử dụng key image_base64 nhưng giá trị bỏ trống.
10 String base64 is not valid -- Request sử dụng key image_base64 nhưng string cung cấp không hợp lệ.
