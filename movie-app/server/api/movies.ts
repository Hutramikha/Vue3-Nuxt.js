// server/api/movies.ts
// Tổng 50 phim: 10 phim × 5 danh mục = 50 phim
// Mỗi danh mục có phân trang: 5 phim/trang × 2 trang = 10 phim/danh mục
// Hỗ trợ lọc phía server: ?genre=Hành động&year=2024&search=phim
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // ========== DANH SÁCH TẤT CẢ PHIM ==========
  const allMovies = [
    // ===== DANH MỤC 1: PHIM MỚI CẬP NHẬT (10 PHIM) =====
    { id: 1, title: "Lật Mặt 7: Một Điều Ước", poster: "/images/posters/lat-mat-7.jpg", year: "2024", genre: "Tâm Lý, Gia Đình", rating: 9.0, synopsis: "Câu chuyện xoay quanh những ước mơ, tình yêu và gia đình trong bối cảnh Việt Nam hiện đại. Khi một người đàn ông quay lại quê nhà, anh phải đối mặt với những lựa chọn khó khăn và tái kết nối với những người thân yêu.", trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 2, title: "Mai", poster: "/images/posters/mai.jpg", year: "2024", genre: "Tâm Lý, Kịch", rating: 8.5, synopsis: "Một bộ phim tâm lý sâu sắc về tình yêu, mất mát và sự cứu chuộc. Câu chuyện theo dõi hành trình của các nhân vật khi họ tìm kiếm ý nghĩa trong cuộc sống sau những nỗi đau xảy ra.", trailerUrl: "https://www.youtube.com/embed/5qap5aO4i9A" },
    { id: 3, title: "Deadpool & Wolverine", poster: "/images/posters/deadpool-wolverine.jpg", year: "2024", genre: "Hành Động, Hài", rating: 8.8, synopsis: "Hai anh chàng siêu anh hùng tập trung vào sự tự phục hồi gặp nhau trong một hành trình đầy hài hước và bạo lực. Hợp tác giữa Deadpool và Wolverine mang lại những trận chiến tuyệt vời và khoảnh khắc vui nhộn.", trailerUrl: "https://www.youtube.com/embed/73_1biulkYk" },
    { id: 4, title: "Dune: Part Two", poster: "/images/posters/dune-part-two.jpg", year: "2024", genre: "Viễn Tưởng, Phiêu Lưu", rating: 9.2, synopsis: "Phần tiếp theo của tác phẩm kinh điển viễn tưởng. Paul Atreides tiếp tục hành trình của mình trên hành tinh sa mạc Arrakis, nơi anh phải thích nghi với cuộc chiến chính trị và các lực lượng vũ trụ phức tạp.", trailerUrl: "https://www.youtube.com/embed/n9xhJsxPeKE" },
    { id: 5, title: "Inside Out 2", poster: "/images/posters/inside-out-2.jpg", year: "2024", genre: "Hoạt Hình, Gia Đình", rating: 8.9, synopsis: "Chiều sâu tâm tưởng của một vị thiếu nữ được khám phá qua những tình cảm được nhân cách hóa. Khi cô ấy bước vào tuổi vị thành niên, những cảm xúc mới xuất hiện và gây ra những cuộc xung đột hài hước.", trailerUrl: "https://www.youtube.com/embed/tIzlVGVx2oo" },
    { id: 6, title: "The Brutalist", poster: "/images/posters/the-brutalist.jpg", year: "2023", genre: "Chính Kịch", rating: 8.7, synopsis: "Một nhà kiến trúc tồn tại qua Thế chiến II tìm cách xây dựng lại cuộc sống ở một đất nước mới. Bộ phim khám phá tâm thế của người sáng tạo đối mặt với các hạn chế và sự kỳ vọng của xã hội.", trailerUrl: "https://www.youtube.com/embed/ek1PoXyheDE" },
    { id: 7, title: "Oppenheimer", poster: "/images/posters/oppenheimer.jpg", year: "2023", genre: "Chính Kịch, Lịch Sử", rating: 8.6, synopsis: "Tiểu sử kịch tính của J. Robert Oppenheimer, người chỉ đạo dự án Manhattan. Bộ phim khám phá những lựa chọn đạo đức và hậu quả của việc tạo ra vũ khí hạt nhân.", trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg" },
    { id: 8, title: "Barbie", poster: "/images/posters/barbie.jpg", year: "2023", genre: "Hài, Phiêu Lưu", rating: 8.0, synopsis: "Barbie rời xứ sở Barbie màu hồng để khám phá thế giới thực. Cô gặp phải những bất ngờ và phải tìm hiểu lại bản thân mình trong bối cảnh hiện đại.", trailerUrl: "https://www.youtube.com/embed/FLwSYU4J5UY" },
    { id: 9, title: "Killers of the Flower Moon", poster: "/images/posters/killers.jpg", year: "2023", genre: "Tội Phạm, Chính Kịch", rating: 8.8, synopsis: "Dựa trên các sự kiện lịch sử, bộ phim kể về một chuỗi vụ giết người chống lại người Osage đầy tiền dầu ở Oklahoma trong những năm 1920.", trailerUrl: "https://www.youtube.com/embed/I62bGa8sgGo" },
    { id: 10, title: "The Godfather", poster: "/images/posters/godfather.jpg", year: "1972", genre: "Tội Phạm, Chính Kịch", rating: 9.3, synopsis: "Tác phẩm kinh điển về gia đình tội phạm Corleone. Câu chuyện theo dõi sự chuyển giao quyền lực từ thế hệ này sang thế hệ khác, cùng với các mâu thuẫn nội bộ.", trailerUrl: "https://www.youtube.com/embed/KiVzlZpCuWk" },

    // ===== DANH MỤC 2: PHIM HOT HIỆN TẠI (10 PHIM) =====
    { id: 11, title: "Avatar", poster: "/images/posters/avatar.jpg", year: "2009", genre: "Viễn Tưởng, Phiêu Lưu", rating: 7.9, synopsis: "Trên mặt trăng Pandora ngoài không gian, một người lính tái sinh dưới dạng một Avatar để hoàn thành nhiệm vụ. Anh thay vào đó tìm thấy một nền văn hóa xứng đáng bảo vệ.", trailerUrl: "https://www.youtube.com/embed/5PSNL1qE6VQ" },
    { id: 12, title: "Titanic", poster: "/images/posters/titanic.jpg", year: "1997", genre: "Tâm Lý, Thảm Họa", rating: 7.8, synopsis: "Bộ phim về tình yêu xuyên biên giới được bối cảnh chìm tàu Titanic huyền thoại. Một chàng trai nghèo và một cô gái giàu vượt qua các rào cản tầng lớp khi họ phải đối mặt với thảm họa.", trailerUrl: "https://www.youtube.com/embed/kVrqfYjkTdQ" },
    { id: 13, title: "The Shawshank Redemption", poster: "/images/posters/shawshank.jpg", year: "1994", genre: "Chính Kịch", rating: 9.3, synopsis: "Câu chuyện về một người đàn ông bị kết án oan trong nhà tù, nơi anh kết bạn với một tù nhân khác và cùng nhau lên kế hoạch trốn thoát. Bộ phim về hy vọng, tình bạn và sự cứu chuộc.", trailerUrl: "https://www.youtube.com/embed/6hB3S9bIaco" },
    { id: 14, title: "Inception", poster: "/images/posters/inception.jpg", year: "2010", genre: "Viễn Tưởng, Hành Động", rating: 8.8, synopsis: "Một kẻ trộm có kỹ năng đặc biệt được giao nhiệm vụ xâm nhập vào giấc mơ những người khác. Anh phải lập kế hoạch một cuộc tấn công phức tạp để thực hiện một ý tưởng vào tâm trí của ai đó.", trailerUrl: "https://www.youtube.com/embed/YoHD_XwIlNw" },
    { id: 15, title: "The Dark Knight", poster: "/images/posters/dark-knight.jpg", year: "2008", genre: "Hành Động, Tội Phạm", rating: 9.0, synopsis: "Batman phải đối mặt với kẻ thù tuyệt vời nhất của mình, Joker. Bộ phim khám phá ranh giới giữa công lý và hỗn loạn trong thành phố Gotham.", trailerUrl: "https://www.youtube.com/embed/ghM-7zwobEI" },
    { id: 16, title: "Interstellar", poster: "/images/posters/interstellar.jpg", year: "2014", genre: "Viễn Tưởng, Kịch", rating: 8.6, synopsis: "Một nhóm nhà du hành vũ trụ được gửi qua một lỗ sâu để tìm một hành tinh mới cho loài người. Bộ phim là một chú thích về tình yêu, hy vọng và kích thước của vũ trụ.", trailerUrl: "https://www.youtube.com/embed/zSID6AWvubE" },
    { id: 17, title: "Pulp Fiction", poster: "/images/posters/pulp-fiction.jpg", year: "1994", genre: "Tội Phạm, Chính Kịch", rating: 8.9, synopsis: "Một bộ phim phi tuyến tính khám phá cuộc sống của các tên cướp, tay buôn ma túy, vũ công và người chồng của ông trùm. Các câu chuyện gắn kết theo những cách bất ngờ.", trailerUrl: "https://www.youtube.com/embed/s7EdQ4FqbdY" },
    { id: 18, title: "Forrest Gump", poster: "/images/posters/forrest-gump.jpg", year: "1994", genre: "Chính Kịch, Tâm Lý", rating: 8.8, synopsis: "Một người đàn ông có chỉ số IQ thấp nhưng có một trái tim lớn nhất tham gia vào nhiều sự kiện lịch sử quan trọng. Bộ phim là một cuộc thám hiểm về cuộc sống, tình yêu và vận mệnh.", trailerUrl: "https://www.youtube.com/embed/bIvzrx3B6lg" },
    { id: 19, title: "The Matrix", poster: "/images/posters/matrix.jpg", year: "1999", genre: "Viễn Tưởng, Hành Động", rating: 8.7, synopsis: "Một hacker khám phá rằng thế giới anh đang sống là một mô phỏng máy tính. Anh được giải phóng và tham gia vào cuộc chiến chống lại các máy điều khiển loài người.", trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8" },
    { id: 20, title: "Gladiator", poster: "/images/posters/gladiator.jpg", year: "2000", genre: "Hành Động, Lịch Sử", rating: 8.5, synopsis: "Một tướng quân La Mã được kô và bán thành nô lệ. Anh huấn luyện để trở thành chiến binh đấu trường, từng bước tìm cách trả thù những kẻ giết hại gia đình anh.", trailerUrl: "https://www.youtube.com/embed/owK1qxDsel8" },

    // ===== DANH MỤC 3: PHIM ĐƯỢC XEM NHIỀU (10 PHIM) =====
    { id: 21, title: "The Lion King", poster: "/images/posters/lion-king.jpg", year: "1994", genre: "Hoạt Hình, Gia Đình", rating: 8.5, synopsis: "Một chú sư tử con phải vượt qua nỗi buồn và phản bội để trở thành vua của những sư tử. Bộ phim kinh điển về lớn lên, trách nhiệm và cuộc xung đột gia đình.", trailerUrl: "https://www.youtube.com/embed/AWBZIgUS2bU" },
    { id: 22, title: "Jaws", poster: "/images/posters/jaws.jpg", year: "1975", genre: "Kinh Dị, Thảm Họa", rating: 8.1, synopsis: "Một thị trấn ven biển bị khủng hoảng khi một con cá mập khổng lồ bắt đầu tấn công. Ba người đàn ông phải đối mặt với quái vật trong những cuộc đấu tranh khí thúc sâu sắc.", trailerUrl: "https://www.youtube.com/embed/U3CTb2Hg3ww" },
    { id: 23, title: "E.T. the Extra-Terrestrial", poster: "/images/posters/et.jpg", year: "1982", genre: "Viễn Tưởng, Gia Đình", rating: 7.9, synopsis: "Một tên ngoài hành tinh bị mắc kẹt trên Trái Đất tìm thấy tình bạn với một cậu bé. Cô gái phải giúp E.T. trở về nhà trong khi tránh những người truy lùng.", trailerUrl: "https://www.youtube.com/embed/qqQ8p7g9msI" },
    { id: 24, title: "Back to the Future", poster: "/images/posters/bttf.jpg", year: "1985", genre: "Viễn Tưởng, Hài", rating: 8.5, synopsis: "Một thanh niên được gửi ngược thời gian 30 năm và vô tình thay đổi lịch sử. Anh phải tìm cách quay trở lại tương lai mà không phá vỡ quá khứ của cha mẹ mình.", trailerUrl: "https://www.youtube.com/embed/qvsgGtivCgs" },
    { id: 25, title: "The Sixth Sense", poster: "/images/posters/sixth-sense.jpg", year: "1999", genre: "Kinh Dị, Kịch", rating: 8.2, synopsis: "Một bác sĩ tâm thần làm việc với một cậu bé có khả năng nhìn thấy những người đã chết. Khi họ cố gắng giúp các linh hồn bị ám ảnh, một bí mật lớn bị hé lộ.", trailerUrl: "https://www.youtube.com/embed/3A90zzQ48os" },
    { id: 26, title: "Jurassic Park", poster: "/images/posters/jurassic-park.jpg", year: "1993", genre: "Viễn Tưởng, Hành Động", rating: 8.1, synopsis: "Một công viên dành cho khủng long được tái tạo qua công nghệ di truyền. Khi những con vật thoát ra, các du khách tìm cách sống sót giữa những con thú tuyệt chủng.", trailerUrl: "https://www.youtube.com/embed/PJlmYh27MHg" },
    { id: 27, title: "Independence Day", poster: "/images/posters/independence-day.jpg", year: "1996", genre: "Viễn Tưởng, Hành Động", rating: 7.0, synopsis: "Ngoài hành tinh tấn công Trái Đất và nhân loại phải hợp tác để bảo vệ hành tinh. Bộ phim về sự hợp tác, lòng dũng cảm và hy vọng của loài người.", trailerUrl: "https://www.youtube.com/embed/G_-nHLDBsuI" },
    { id: 28, title: "The Avengers", poster: "/images/posters/avengers.jpg", year: "2012", genre: "Hành Động, Viễn Tưởng", rating: 8.0, synopsis: "Các anh hùng độc lập phải hợp tác khi một lực lượng ngoài hành tinh đe dọa Trái Đất. Bộ phim khám phá những xung đột nội bộ và sự cần thiết phải làm việc cùng nhau.", trailerUrl: "https://www.youtube.com/embed/eOrNdBpgMEo" },
    { id: 29, title: "Iron Man", poster: "/images/posters/iron-man.jpg", year: "2008", genre: "Hành Động, Viễn Tưởng", rating: 7.9, synopsis: "Một doanh nhân phát triển công nghệ bộ giáp tiên tiến để trở thành một anh hùng. Bộ phim khám phá sự chuyển đổi từ bộ óc kiêu căng sang một người có lương tâm.", trailerUrl: "https://www.youtube.com/embed/8hYlB38asDY" },
    { id: 30, title: "Thor", poster: "/images/posters/thor.jpg", year: "2011", genre: "Hành Động, Viễn Tưởng", rating: 7.0, synopsis: "Một thần được gửi xuống Trái Đất và phải học về khiêm tốn. Anh phải tìm cách trở lại Asgard để ngăn chặn một đe dọa vũ trụ.", trailerUrl: "https://www.youtube.com/embed/JOddp-qIumY" },

    // ===== DANH MỤC 4: TRENDING HÔM NAY (10 PHIM) =====
    { id: 31, title: "Captain America", poster: "/images/posters/captain-america.jpg", year: "2011", genre: "Hành Động, Viễn Tưởng", rating: 6.9, synopsis: "Một người lính được cải tiến bằng huyết thanh siêu quân được thức tỉnh từ giấc ngủ 70 năm. Anh phải thích nghi với thế giới hiện đại trong khi chấp nhận vai trò mới của mình.", trailerUrl: "https://www.youtube.com/embed/Gg9s-I9PHdE" },
    { id: 32, title: "Black Panther", poster: "/images/posters/black-panther.jpg", year: "2018", genre: "Hành Động, Viễn Tưởng", rating: 7.3, synopsis: "Người thừa kế của một quốc gia ẩn giấu phải vương miện để bảo vệ đất nước của mình. Anh phải đối mặt với những lực lượng cạnh tranh và quyết định số phận của đất nước.", trailerUrl: "https://www.youtube.com/embed/xjDjIWPwcPU" },
    { id: 33, title: "Doctor Strange", poster: "/images/posters/doctor-strange.jpg", year: "2016", genre: "Hành Động, Viễn Tưởng", rating: 7.5, synopsis: "Một bác sĩ tự cao tập luyện trở thành một pháp sư bảo vệ Trái Đất khỏi những mối đe dọa tâm linh. Bộ phim khám phá khiêm tốn, hy vọng và sức mạnh của tâm trí.", trailerUrl: "https://www.youtube.com/embed/_QiTekfuWjg" },
    { id: 34, title: "Guardians of the Galaxy", poster: "/images/posters/guardians.jpg", year: "2014", genre: "Hành Động, Hài", rating: 8.0, synopsis: "Một nhóm phe phái ngoài hành tinh được mắc kẹt cùng nhau phải hợp tác để sống sót. Bộ phim là một cuộc phiêu lưu vui nhộn với một âm thanh nền tuyệt vời.", trailerUrl: "https://www.youtube.com/embed/aXv3Eo6yMLc" },
    { id: 35, title: "Ant-Man", poster: "/images/posters/ant-man.jpg", year: "2015", genre: "Hành Động, Hài", rating: 7.3, synopsis: "Một kẻ trộm được tuyển dụng để mang một bộ giáp cho phép anh ấy thu nhỏ lại. Anh phải sử dụng kỹ năng mới của mình để thực hiện một trục lợi lớn và cứu gia đình mình.", trailerUrl: "https://www.youtube.com/embed/7CXnPxvfZxI" },
    { id: 36, title: "Spider-Man", poster: "/images/posters/spider-man.jpg", year: "2002", genre: "Hành Động, Viễn Tưởng", rating: 7.3, synopsis: "Một cậu bé được cắn bởi một con nhện đột biến và phát triển những siêu năng lực. Anh phải học cách sử dụng quyền lực này một cách chịu trách nhiệm.", trailerUrl: "https://www.youtube.com/embed/OW2G-c3sNtE" },
    { id: 37, title: "X-Men", poster: "/images/posters/x-men.jpg", year: "2000", genre: "Hành Động, Viễn Tưởng", rating: 7.4, synopsis: "Một nhóm con người có khả năng đột biến phải đảy lùi một âm mưu phân biệt đối xử. Bộ phim khám phá những chủ đề về chấp nhận và phân biệt đối xử.", trailerUrl: "https://www.youtube.com/embed/LGUfyI1qN3c" },
    { id: 38, title: "Fantastic Four", poster: "/images/posters/fantastic-four.jpg", year: "2005", genre: "Hành Động, Viễn Tưởng", rating: 5.7, synopsis: "Bốn nhà khoa học được phơi nhiễm với tia vũ trụ và phát triển những siêu năng lực khác nhau. Họ phải kết hợp những sức mạnh của mình để chống lại một kẻ thù cũ.", trailerUrl: "https://www.youtube.com/embed/S2zJvlDa65g" },
    { id: 39, title: "Blade", poster: "/images/posters/blade.jpg", year: "1998", genre: "Hành Động, Kinh Dị", rating: 7.1, synopsis: "Một nhân vật được sinh ra từ vụ tấn công của ma cà rồng trở thành một thợ săn ma cà rồng. Anh sử dụng những kỹ năng của mình để bảo vệ loài người khỏi những con vật đêm.", trailerUrl: "https://www.youtube.com/embed/GfMhP9hD0fU" },
    { id: 40, title: "The Hulk", poster: "/images/posters/hulk.jpg", year: "2003", genre: "Hành Động, Viễn Tưởng", rating: 5.7, synopsis: "Một nhà khoa học ra marred bị phơi nhiễm với tia gamma và biến thành một quái vật khủng khiếp khi anh giận dữ. Anh phải tìm cách kiểm soát sức mạnh này.", trailerUrl: "https://www.youtube.com/embed/G5UpFxcjdNc" },
    // ===== DANH MỤC 5: PHIM LẺ MỚI RA MẮT (10 PHIM) =====
    { id: 41, title: "Avatar 2: The Way of Water", poster: "/images/posters/avatar-2.jpg", year: "2022", genre: "Viễn Tưởng, Phiêu Lưu", rating: 7.2, synopsis: "Năm năm sau sự kiện đầu tiên, Jake Sully phải bảo vệ gia đình mình khỏi những kẻ tấn công trên Pandora.", trailerUrl: "https://www.youtube.com/embed/d9MyW72EhRE" },
    { id: 42, title: "Top Gun: Maverick", poster: "/images/posters/top-gun-maverick.jpg", year: "2022", genre: "Hành Động, Chính Kịch", rating: 8.3, synopsis: "Một phi công huyền thoại được triệu tập lại để huấn luyện một tác vụ bạo lực nhất mà anh từng thao tác.", trailerUrl: "https://www.youtube.com/embed/FgQcbaD73kc" },
    { id: 43, title: "Doctor Strange 2", poster: "/images/posters/ds2.jpg", year: "2022", genre: "Hành Động, Viễn Tưởng", rating: 6.9, synopsis: "Bác sĩ Strange du hành qua đa vũ trụ để cứu một người phụ nữ trẻ và ngăn chặn một mối đe dọa tâm linh.", trailerUrl: "https://www.youtube.com/embed/aWzlQ2N6rug" },
    { id: 44, title: "Lightyear", poster: "/images/posters/lightyear.jpg", year: "2022", genre: "Hoạt Hình, Viễn Tưởng", rating: 7.0, synopsis: "Câu chuyện về Buzz Lightyear khi anh là một phi công du hành không gian.", trailerUrl: "https://www.youtube.com/embed/BwG__1vMKAw" },
    { id: 45, title: "Minions: Rise of Gru", poster: "/images/posters/minions.jpg", year: "2022", genre: "Hoạt Hình, Hài", rating: 6.6, synopsis: "Gru trẻ tuổi tìm cách trở thành một tên cướp ngân hàng với sự trợ giúp của những chú minion.", trailerUrl: "https://www.youtube.com/embed/CXWRGEv88Ec" },
    { id: 46, title: "The Lost City", poster: "/images/posters/lost-city.jpg", year: "2022", genre: "Phiêu Lưu, Hài", rating: 6.5, synopsis: "Một tác giả tiểu thuyết tình yêu bị bắt cóc tưởng rằng đã được cứu bởi một mẫu người đẹp tơ tưởng.", trailerUrl: "https://www.youtube.com/embed/Zn1bnMM2dQk" },
    { id: 47, title: "Uncharted", poster: "/images/posters/uncharted.jpg", year: "2022", genre: "Hành Động, Phiêu Lưu", rating: 6.3, synopsis: "Một kẻ trộm tài ba được tuyển dụng để tìm kiếm kho báu của một seafarer huyền thoại.", trailerUrl: "https://www.youtube.com/embed/kS-lhGYLs3E" },
    { id: 48, title: "Morbius", poster: "/images/posters/morbius.jpg", year: "2022", genre: "Hành Động, Kinh Dị", rating: 5.2, synopsis: "Một nhà khoa học mắc bệnh hiếm muốn tìm cách chữa trị bằng cách thử nghiệm một chế độ dựa trên máu dơi.", trailerUrl: "https://www.youtube.com/embed/FrPu1dJwi2E" },
    { id: 49, title: "The Batman", poster: "/images/posters/the-batman.jpg", year: "2022", genre: "Hành Động, Tội Phạm", rating: 7.7, synopsis: "Batman điều tra một loạt vụ giết người được thực hiện bởi một kẻ điên loạn được biết đến dưới cái tên Riddler.", trailerUrl: "https://www.youtube.com/embed/mqqft2x_Aa4" },
    { id: 50, title: "Everything Everywhere All at Once", poster: "/images/posters/everything.jpg", year: "2022", genre: "Viễn Tưởng, Chính Kịch", rating: 8.0, synopsis: "Một phụ nữ khối phòng bị cuốn vào một cuộc phiêu lưu đa vũ trụ để cứu cô ấy gia đình.", trailerUrl: "https://www.youtube.com/embed/wtDMW7-8MeE" }
  ]

  // ========== THÊM FIELD TYPE (PHIM LẺ/BỘ) ==========
  // Thêm type field cho mỗi phim dựa vào ID
  // - ID 1-25: type = 'single' (phim lẻ)
  // - ID 26-50: type = 'series' (phim bộ)
  const moviesWithType = allMovies.map((movie: any) => ({
    ...movie,
    type: movie.id <= 25 ? 'single' : 'series'
  }))

  // ========== LOGIC FILTER SERVER-SIDE ==========
  const query = getQuery(event)
  const genre = query.genre as string
  const year = query.year as string
  const search = query.search as string

  let filteredMovies = [...moviesWithType]

  // Filter theo thể loại
  if (genre) {
    filteredMovies = filteredMovies.filter((movie: any) =>
      movie.genre.includes(genre)
    )
  }

  // Filter theo năm
  if (year) {
    filteredMovies = filteredMovies.filter((movie: any) =>
      movie.year === year
    )
  }

  // Filter theo tìm kiếm
  if (search) {
    const searchLower = search.toLowerCase()
    filteredMovies = filteredMovies.filter((movie: any) =>
      movie.title.toLowerCase().includes(searchLower) ||
      movie.genre.toLowerCase().includes(searchLower)
    )
  }

  return filteredMovies
})