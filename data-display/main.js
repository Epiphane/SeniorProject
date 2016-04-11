var Test = React.createClass({
	render: function() {
		return (
		    <div>
		    	Hi there! I'm a cool div.
		    </div>
		)
	}
});

React.render(<Test />,
             document.getElementById('react-container'));