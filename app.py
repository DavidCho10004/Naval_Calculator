from flask import Flask, render_template, request, jsonify
import logging
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

logging.basicConfig(level=logging.INFO)

def validate_input(data):
    required_fields = ['displacement', 'breadth', 'gom', 'mtc', 'lcf', 'fwd_draft', 
                       'mid_p_draft', 'mid_s_draft', 'aft_draft', 'position', 'position_center']
    for field in required_fields:
        if field not in data or not isinstance(data[field], (int, float)):
            return False
    return True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    if not validate_input(data):
        return jsonify({'error': 'Invalid input data'}), 400

    try:
        displacement = data['displacement']
        breadth = data['breadth']
        gom = data['gom']
        mtc = data['mtc']
        lcf = data['lcf']
        fwd_draft = data['fwd_draft']
        mid_p_draft = data['mid_p_draft']
        mid_s_draft = data['mid_s_draft']
        aft_draft = data['aft_draft']
        position = data['position']
        position_center = data['position_center']

        # Trim and Heel calculations
        trim = round((fwd_draft - aft_draft) * 100, 1)
        heel = round((mid_s_draft - mid_p_draft) * 100, 1)

        # Trim adjustment calculation
        weight_trim = (trim * mtc) / (position - lcf) if position != lcf else 0

        # Heel adjustment calculation
        weight_heel = (heel / breadth) * displacement * gom / position_center if position_center != 0 else 0

        weight = round(weight_trim + weight_heel, 2)

        logging.info(f"Calculation performed: weight={weight}, trim={trim}, heel={heel}")
        return jsonify({'weight': weight, 'trim': trim, 'heel': heel})

    except ZeroDivisionError:
        logging.error("Division by zero occurred during calculation")
        return jsonify({'error': 'Division by zero error'}), 400
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'])