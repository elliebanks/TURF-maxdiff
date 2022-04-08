import pandas as pd
from math import e


"""
Function for taking in the values from the sawtooth exported file, and returning the raw utilities and the rescaled utilities

"""
def process_raw_util_xl_file(xl_fn):
    df = pd.read_excel(xl_fn)  # read the excel file
    row = df.shape[0]  # df.shape[0] = Number of rows, df.shape[1] = number of columns
    index_col = [col for col in df if 'id' in col.lower()][0]
    df.set_index(index_col, inplace=True)  # Setting the ID as the index
    # weights = df['Weights'] if 'Weights' in df else pd.Series([1]*row)         # Creating the weights array if there are weights , otherwise an array of 1's with # of rows

    if 'Weights' not in df:
        df['Weights'] = 1


    weights = df['Weights']
    df.drop('Weights', axis=1, inplace=True)
    sum = weights.values.sum()  # Sum of the weights

    # if 'Weights' in df: df = df.drop('Weights', axis=1)                        # removing weights from df if they are there
    rlh_cols = [col for col in df if 'rlh' in col.lower()][:1]
    df = df.drop(rlh_cols, axis=1)  # removing RLH from df if they are there

    max_diff_scores = (e ** df) / (1 + e ** df) * 100  # exp the values of the dataframe with

    utils = df

    return {
        "utilities": utils,
        "claims": [col for col in utils],
        "maxdiff_scores": max_diff_scores,
        "weights": weights
    }

"""
Function to get the reach scores for the items that are ON and Summary Metrics
"""

def calc_reach_metrics(maxdiff_scores, claims_on_list, weights):

    reached = (maxdiff_scores >= 75).astype(int) # converting reached into binary

    reached_items_on = reached[claims_on_list]

    reached_items_on_weighted = reached_items_on.mul(weights, axis=0)  # calculate weighted reach of items that are on
    
    sum_of_weights = weights.values.sum()

    average_reach_percentage_items_on_wtd = (reached_items_on_weighted.sum(axis=0, skipna=True)) / sum_of_weights  # average weighted reach of all the items that are on

    # Count the number of items in the datafile
    number_of_items = reached_items_on.shape[1]

    # items liked average
    num_liked_average_items_on_wtd = (((reached_items_on.sum(axis=1)).mul(weights, axis=0)).sum(axis=0)) / sum_of_weights # average number liked summary metrics weighted

    # calculate the unduplicated reach of the items that are on
    unduplicated_reached_items_on_wtd = (((((reached_items_on.sum(axis=1)) > 0 ).astype(int)).mul(weights, axis=0)).sum(axis=0)) / sum_of_weights
    print(unduplicated_reached_items_on_wtd)

    # calculate the favourite percentage of the items that are on
    favourite_binary = maxdiff_scores.eq(maxdiff_scores.max(axis=1), axis=0).astype(int)

    favourite_binary_on = favourite_binary[claims_on_list]

    fav_scores_items_on = ((favourite_binary_on.mul(weights, axis=0)).sum(axis=0)) / sum_of_weights

    fav_percentage_wtd = fav_scores_items_on.sum(axis=0)

    reach_dict = average_reach_percentage_items_on_wtd.to_dict()
    fav_dict = fav_scores_items_on.to_dict()


    return {
        "Claim_Reach": reach_dict,
        "Claim_Favorite": fav_dict,
        "Summary_Metrics": {
            "Average_Number_of_Items_Liked": num_liked_average_items_on_wtd,
            "Reach": unduplicated_reached_items_on_wtd,
            "Favorite_Percentage": fav_percentage_wtd,
        }
    }

"""
reach function takes in inputs & returns a dictionary with 
    keys: items in order of which they need to be turned on in the simulator, 
    values: metrics in the calc_reach_metrics function
as we go along the keys in the dictionary, values/metrics include the previous items already 'offered'
"""



def get_incremental_reach(max_diff_scores, item_considered, item_on, number_of_items_to_turn_on, weights):
    current_items_to_consider = item_considered.copy()
    current_item_on = item_on.copy()

    get_incremental_reach_summary_metrics = {}  # setting to blank dict

    for i in range(number_of_items_to_turn_on):  # looping for # of items to be added

        steps = {}  # setting steps to be blank dict
        reach_of_items_in_steps = {}  # setting reach_of_items_in_steps to be blank dict
        for test_item in current_items_to_consider:  # looping through all the items that are considered

            new_items_on = [*current_item_on, test_item]  # adding test item to items that are on already

            summary_scores_tested = calc_reach_metrics(max_diff_scores, new_items_on,
                                                       weights)  # calling reach_metric_function


            steps[
                test_item] = summary_scores_tested  # adding the reach_metrics to the steps dict for all the items that are considered, with items name as key

            reach_of_items_in_steps[test_item] = summary_scores_tested['Summary_Metrics'][
                'Reach']  # adding ONLY the unduplicated reach to the reach_of_items_in_steps dict for all the items that are considered, with items name as key

        get_incremental_reach_summary_metrics[max(reach_of_items_in_steps, key=reach_of_items_in_steps.get)] = \
        steps[max(reach_of_items_in_steps,
                  key=reach_of_items_in_steps.get)]  # Item with max reach is key, value is reach metrics of that item
        current_item_on.append(max(reach_of_items_in_steps,
                                   key=reach_of_items_in_steps.get))  # add the item with max reach with item that is on
        current_items_to_consider.remove(max(reach_of_items_in_steps,
                                             key=reach_of_items_in_steps.get))  # remove the items that was found to have the max reach from the considereation

    return {
        "Order of Items": list(get_incremental_reach_summary_metrics.keys()),
        "Incremental Reach Summary": get_incremental_reach_summary_metrics,
    }  # returning the dict for the items that are turned on in order




