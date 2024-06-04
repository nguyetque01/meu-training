using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using backend.Models;
using Microsoft.IdentityModel.Tokens;

namespace backend.Helpers
{
    public class SearchHelper
    {
        private char[] punctuationMarks = { ' ', '-', ':', ',', '.', '?', '!' };
        private List<string> validColumns = new List<string> { "id", "code", "name", "category", "brand", "type", "description" };

        public IQueryable<Product> ApplyProductSearchFilter(IQueryable<Product> query, string search, string searchColumn, string searchType)
        {
            string formattedSearch = search.ToLower();

            if (string.IsNullOrEmpty(searchColumn) || searchColumn.Equals("all", StringComparison.OrdinalIgnoreCase))
            {
                var filteredQuery = query.Where(BuildSearchCondition(null, searchType), formattedSearch);

                foreach (var product in filteredQuery.ToList())
                {
                    foreach (var column in validColumns)
                    {
                        UpdateProductSearchMatches(product, column, formattedSearch, searchType);
                    }
                }

                return filteredQuery;
            }

            if (validColumns.Contains(searchColumn, StringComparer.OrdinalIgnoreCase))
            {
                var filteredQuery = query.Where(BuildSearchCondition(searchColumn, searchType), formattedSearch);

                foreach (var product in filteredQuery.ToList())
                {
                    UpdateProductSearchMatches(product, searchColumn, formattedSearch, searchType);
                }

                return filteredQuery;
            }

            throw new ArgumentException("Invalid search column");            
        }

        private void UpdateProductSearchMatches(Product product, string column, string search, string searchType)
        {
            string col = char.ToUpper(column[0]) + column.Substring(1);
            string value = (product.GetType().GetProperty(col)?.GetValue(product, null)?.ToString()?.ToLower()) ?? "default";
            List<int> foundPositions = new List<int>();

            var words = value.Split(' ');
            int searchLength = search.Split(' ').Length;
            int textLength = words.Length;

            for (int i = 0; i < textLength - searchLength + 1; i++)
            {
                string[] subWords = words.Skip(i).Take(searchLength).ToArray();
                string subText = string.Join(" ", subWords);

                if (IsMatchCondition(search, subText, searchType))
                {
                    foundPositions.Add(i);
                }
            }

            if (foundPositions.Any())
            {
                if (!product.SearchMatches.ContainsKey(column))
                {
                    product.SearchMatches[column] = foundPositions;
                }
                else
                {
                    product.SearchMatches[column].AddRange(foundPositions);
                }
            }
        }

        private string BuildSearchCondition(string? column = null, string searchType = "")
        {
            List<string> conditions = new List<string>();

            if (column == null)
            {
                foreach (string col in validColumns)
                {
                    conditions.Add(BuildConditionExpression(col, searchType));
                }
            }
            else
            {
                conditions.Add(BuildConditionExpression(column, searchType));
            }

            return string.Join(" || ", conditions);
        }

        private string BuildConditionExpression(string column, string searchType)
        {
            string processedColumn = $"{column}.ToString().ToLower()";

            if (searchType == "exact")
            {
                List<string> conditionParts = new List<string>();

                foreach (char punctuationMark in punctuationMarks)
                {
                    conditionParts.Add($"{processedColumn}.Equals(@0)");
                    conditionParts.Add($"{processedColumn}.StartsWith(@0 + \"{punctuationMark}\")");
                    conditionParts.Add($"{processedColumn}.EndsWith(\"{punctuationMark}\" + @0)");
                    conditionParts.Add($"{processedColumn}.Contains(\" \" + @0 + \"{punctuationMark}\")");
                }

                return string.Join(" || ", conditionParts);
            }

            return $"{processedColumn}.Contains(@0)";
        }

        private bool IsMatchCondition(string search, string text, string type)
        {
            string processedSearch = search.ToLower();
            string processedText = text.ToLower();

            if (type == "exact")
            {
                foreach (char punctuationMark in punctuationMarks)
                {
                    if (processedText.Equals(processedSearch) ||
                        processedText.StartsWith(processedSearch + punctuationMark) ||
                        processedText.EndsWith(punctuationMark + processedSearch) ||
                        processedText.Contains(" " + processedSearch + punctuationMark))
                    {
                        return true;
                    }
                }
                return false;
            }
            
            return processedText.Contains(processedSearch); 
        }
    }
}