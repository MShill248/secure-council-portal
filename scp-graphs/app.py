from flask import Flask, jsonify, request
import matplotlib.pyplot as plt
import plotly.graph_objs as go
import io
import base64
import os

app = Flask(__name__)

@app.route("/generate-visualisation", methods=["POST"])
def generate_visualisation():
    data = request.json

    x = data.get('x', [])
    y = data.get('y', [])

    fig, ax = plt.subplots()

    ax.bar(x, y)

    ax.set_title("Number of reports in each category")
    ax.set_xlabel("Category")
    ax.set_ylabel("Total")

    plotly_fig = go.Figure(data=[go.Bar(x=x, y=y)])

    fig_html = plotly_fig.to_html(full_html=False, include_plotlyjs='cdn')

    return jsonify({'visualisation_html': fig_html})

if __name__ == '__main__':
    port = int(os.getenv("PORT", 3001))
    app.run(debug=True, host='0.0.0.0', port=port)