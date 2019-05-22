const setupTestEnvironment = () => {

	//setup the default DOM environment
    document.body.innerHTML = "<p id=\"paragraph\">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>";
    //setup readJS configuration
    window.readJSConfig = {
        el: "#paragraph",
        cb: function() {
            console.log("Article has been read.");
        },
        spa:true
    };

};

//https://davidwalsh.name/monkey-patching
const mockGetBoundingClientRect = (dimensions = { width: 500, height:500, top:0, left:0, right:524, bottom:268, x:0, y:0 }) => {
    //mocking a 500 x 500px square at the top left corner of the viewport that is 100% in view of a 1024 x 768 viewport size by default
    //you can overwrite the default
    const getBoundingClientRectSpy = jest.fn(() => ({width:dimensions.width, height:dimensions.height, top:dimensions.top, left:dimensions.left, right:dimensions.right, bottom: dimensions.bottom, x:dimensions.x, y:dimensions.y }));
    global.document.getElementById = jest.fn(() => ({
        getBoundingClientRect: getBoundingClientRectSpy  // <= add getBoundingClientRect
    }));
    global.document.querySelector = jest.fn(() => ({
        getBoundingClientRect: getBoundingClientRectSpy  // <= add getBoundingClientRect
    }));
    global.document.querySelectorAll = jest.fn(() => ([{
        getBoundingClientRect: getBoundingClientRectSpy  // <= add getBoundingClientRect
    }]));
};

module.exports = {
	setupTestEnvironment: setupTestEnvironment,
	mockGetBoundingClientRect: mockGetBoundingClientRect
}