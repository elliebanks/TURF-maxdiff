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


