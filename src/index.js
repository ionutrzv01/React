import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./App.css";

var ID = function() {
	return (
		"_" +
		Math.random()
			.toString(36)
			.substr(2, 9)
	);
};

class Grupa extends React.Component {
	constructor() {
		super();
		this.state = {
			studenti: [
				{
					nume: "Popescu",
					prenume: "Adrian",
					varsta: 20,
					media: 6.89,
					id: 1
				},
				{
					nume: "Micu",
					prenume: "Sebastian",
					varsta: 22,
					media: 3.24,
					id: 2
				},
				{
					nume: "Mihaiescu",
					prenume: "Octavian",
					varsta: 19,
					media: 5.45,
					id: 3
				},
				{
					nume: "Bacalu",
					prenume: "Robert",
					varsta: 21,
					media: 8.8,
					id: 4
				},
				{
					nume: "Iancu",
					prenume: "Ion",
					varsta: 20,
					media: 4.65,
					id: 5
				}
			],
			campuri: [
				{
					numeCamp: "nume",
					displayName: "Nume"
				},
				{
					numeCamp: "prenume",
					displayName: "Prenume"
				},
				{
					numeCamp: "varsta",
					displayName: "Varsta"
				},
				{
					numeCamp: "media",
					displayName: "Media"
				}
			],
			dateNoi: {},
			sortData: {
				directieSortare: 0,
				id_coloana: null
			},
			isLoaded: false
		};
	}

	componentDidMount() {
		fetch(
			"https://demo3305866.mockable.io/tema_studenti_react"
		)
			.then(res => res.json())
			.then(
				result => {
					this.setState({
						isLoaded: true,
						studenti: [
							...this.state.studenti,
							...result.students
						].map(x => {
							x.key = ID();
							return x;
						})
					});
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				error => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			);
	}

	sortData = event => {
		var directieSortare;

		if (
			this.state.sortData.id_coloana ==
			event.target.id
		) {
			directieSortare =
				this.state.sortData.directieSortare *
				-1;
		} else {
			directieSortare = 1;
		}

		this.setState({
			sortData: {
				id_coloana: event.target.id,
				directieSortare: directieSortare
			}
		});

		this.setState({
			studenti: this.state.studenti.sort(
				(a, b) => {
					var x = a[event.target.id];
					var y = b[event.target.id];
					if (x > y) {
						return directieSortare;
					} else if (x < y) {
						return directieSortare * -1;
					}
					return 0;
				}
			)
		});
	};

	removeStudent = event => {
		this.setState({
			studenti: this.state.studenti.filter(
				x => {
					return (
						x.nume + x.prenume !=
						event.target.id
					);
				}
			)
		});
	};

	updateSearch = event => {
		this.setState({
			searchWord: event.target.value
		});
	};

	updateData = event => {
		this.setState({
			dateNoi: {
				...this.state.dateNoi,
				[event.target.id]: event.target.value
			}
		});
	};

	insertData = event => {
		this.setState({
			studenti: [
				...this.state.studenti,
				this.state.dateNoi
			]
		});
	};

	clickRow = data => {
		this.setState({
			studenti: this.state.studenti.map(x => {
				if (x.nume + x.prenume == data) {
					if (x.clicked == undefined) {
						x = {
							...x,
							clicked: true
						};
					} else {
						x = {
							...x,
							clicked: !x.clicked
						};
					}
				}
				return x;
			})
		});
	};

	getStyle = clicked => {
		if (clicked == undefined) {
			return {};
		} else {
			return {
				"background-color": "lightblue"
			};
		}
	};

	deleteSelected = () => {
		this.setState({
			studenti: this.state.studenti.filter(
				x => {
					return x.clicked != true;
				}
			)
		});
	};

	render() {
		if (this.state.isLoaded == false) {
			return (
				<h1>Data is loading... please wait</h1>
			);
		}
		return (
			<div>
				<table>
					<tr key={ID()}>
						{this.state.campuri.map(x => {
							return (
								<th
									key={ID()}
									id={x.numeCamp}
									onClick={this.sortData}>
									{x.displayName}
								</th>
							);
						})}
						<th>
							<button
								onClick={this.deleteSelected}>
								Delete selected
							</button>
						</th>
					</tr>
					{this.state.studenti.map(student => {
						if (
							student.nume.search(
								new RegExp(
									this.state.searchWord,
									"i"
								)
							) != 0 &&
							student.prenume.search(
								new RegExp(
									this.state.searchWord,
									"i"
								)
							) != 0
						) {
							return null;
						}
						return (
							<tr
								style={
									student.clicked
										? {
												"background-color":
													"lightblue"
										  }
										: {}
								}
								onClick={() =>
									this.clickRow(
										student.nume +
											student.prenume
									)
								}
								key={ID()}>
								{this.state.campuri.map(
									camp => {
										return (
											<th key={ID()}>
												{
													student[
														camp.numeCamp
													]
												}
											</th>
										);
									}
								)}
								<th>
									<button
										onClick={
											this.removeStudent
										}
										id={
											student.nume +
											student.prenume
										}>
										Delete
									</button>
								</th>
							</tr>
						);
					})}

					<tr key={ID()}>
						{this.state.campuri.map(x => {
							return (
								<th key={ID()}>
									<input
										onChange={this.updateData}
										placeholder={x.displayName}
										id={x.numeCamp}
									/>
								</th>
							);
						})}
						<button onClick={this.insertData}>
							Insert
						</button>
					</tr>
					<tr>
						<h3>Search</h3>
						<input
							onChange={this.updateSearch}
						/>
					</tr>
				</table>
			</div>
		);
	}
}

ReactDOM.render(
	<Grupa />,
	document.getElementById("root")
);
