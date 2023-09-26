document.addEventListener('DOMContentLoaded', function () {
    const getImageButton = document.getElementById('getImageButton');
    const downloadLink = document.getElementById('downloadLink');
    const imageElement = document.getElementById('image');

    const getImageFromURL = () => {
        // 콘솔을 통해 뜨는 이미지 URL을 여기에 직접 기입 / ex)https://mediaserv.media36.ec2.st-av.net/image?source_id=f0fd467e-d90f-48a8-a2a3-a773735e29b5&image_id=3a8f5250-5ed8-47c0-a2e0-dba395feddba&correlationId=NUECQ2DVNUKCYJI2";

        const imageURL = "";
        fetch(imageURL, {
            method: 'GET',
            // https://account.smartthings.com/tokens 에서 발급받은 PAT토큰을 "Authorizaiton" 파트의 "Bearer" 옆에 이어서 기입
            headers: {
                "Authorization": "Bearer "
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('이미지를 가져오는 중에 오류가 발생했습니다.');
            }
            return response.blob(); // 이미지 데이터를 Blob으로 변환
        })
        .then((imageBlob) => {
            const objectURL = URL.createObjectURL(imageBlob);
            imageElement.src = objectURL;
            downloadLink.href = objectURL;
        })
        .catch((error) => {
            console.error('이미지 가져오기 오류:', error);
        });
    };

    getImageButton.addEventListener('click', getImageFromURL);
});
